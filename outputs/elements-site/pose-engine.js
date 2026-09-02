import { FilesetResolver, PoseLandmarker } from "./assets/pose/vision_bundle.mjs";

const MODEL_URL = new URL("./assets/pose/pose_landmarker_lite.task", import.meta.url).href;
const WASM_URL = new URL("./assets/pose/wasm", import.meta.url).href;
const JOINTS = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
const MIRROR_MAP = [1, 0, 3, 2, 5, 4, 7, 6, 9, 8, 11, 10, 13, 12, 15, 14];
const JOINT_WEIGHTS = [.6, .6, 1.25, 1.25, 2.2, 2.2, .5, .5, 1.3, 1.3, 2, 2, 1.35, 1.35, 1.65, 1.65];
const TARGET_FRAMES = 24;

let landmarkerPromise;
let activeMode = "VIDEO";
let activeNumPoses = 1;

function midpoint(first, second) {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
    z: (first.z + second.z) / 2
  };
}

function subtract(first, second) {
  return { x: first.x - second.x, y: first.y - second.y, z: first.z - second.z };
}

function length(vector) {
  return Math.hypot(vector.x, vector.y, vector.z);
}

function normalize(vector) {
  const size = length(vector) || 1;
  return { x: vector.x / size, y: vector.y / size, z: vector.z / size };
}

function cross(first, second) {
  return {
    x: first.y * second.z - first.z * second.y,
    y: first.z * second.x - first.x * second.z,
    z: first.x * second.y - first.y * second.x
  };
}

function dot(first, second) {
  return first.x * second.x + first.y * second.y + first.z * second.z;
}

function poseFrameFromResult(result, poseIndex = 0) {
  const landmarks = result.worldLandmarks?.[poseIndex] || result.landmarks?.[poseIndex];
  if (!landmarks?.length) return null;
  const visible = JOINTS.filter(index => (landmarks[index]?.visibility ?? 1) >= .3).length;
  if (visible < 11) return null;

  const shoulderMid = midpoint(landmarks[11], landmarks[12]);
  const hipMid = midpoint(landmarks[23], landmarks[24]);
  const center = hipMid;
  const xAxis = normalize(subtract(landmarks[12], landmarks[11]));
  const torsoAxis = normalize(subtract(hipMid, shoulderMid));
  const zAxis = normalize(cross(xAxis, torsoAxis));
  const yAxis = normalize(cross(zAxis, xAxis));
  const torso = length(subtract(shoulderMid, hipMid));
  const shoulderWidth = length(subtract(landmarks[12], landmarks[11]));
  const hipWidth = length(subtract(landmarks[24], landmarks[23]));
  const scale = Math.max(torso, shoulderWidth, hipWidth, .05);
  const frame = [];

  JOINTS.forEach(index => {
    const point = subtract(landmarks[index], center);
    const visibility = Math.max(0, Math.min(1, landmarks[index].visibility ?? 1));
    frame.push(
      +(dot(point, xAxis) / scale).toFixed(5),
      +(dot(point, yAxis) / scale).toFixed(5),
      +(dot(point, zAxis) / scale).toFixed(5),
      +visibility.toFixed(4)
    );
  });
  return frame;
}

function mirrorFrame(frame) {
  const mirrored = [];
  MIRROR_MAP.forEach(sourceJoint => {
    const offset = sourceJoint * 4;
    mirrored.push(-frame[offset], frame[offset + 1], frame[offset + 2], frame[offset + 3]);
  });
  return mirrored;
}

function interpolateFrame(first, second, amount) {
  return first.map((value, index) => value + (second[index] - value) * amount);
}

function resampleSequence(sequence, target = TARGET_FRAMES) {
  if (!sequence.length) return [];
  if (sequence.length === 1) return Array.from({ length: target }, () => [...sequence[0]]);
  return Array.from({ length: target }, (_, index) => {
    const position = index * (sequence.length - 1) / (target - 1);
    const lower = Math.floor(position);
    const upper = Math.min(sequence.length - 1, Math.ceil(position));
    return interpolateFrame(sequence[lower], sequence[upper], position - lower);
  });
}

function smoothSequence(sequence) {
  return sequence.map((frame, index) => frame.map((value, component) => {
    if (component % 4 === 3) return value;
    const previous = sequence[Math.max(0, index - 1)][component];
    const next = sequence[Math.min(sequence.length - 1, index + 1)][component];
    return previous * .2 + value * .6 + next * .2;
  }));
}

function motionSequence(sequence) {
  return sequence.map((frame, index) => frame.map((value, component) => {
    if (component % 4 === 3 || index === 0) return 0;
    return value - sequence[index - 1][component];
  }));
}

function frameDistance(first, second, firstMotion, secondMotion) {
  let poseTotal = 0;
  let motionTotal = 0;
  let weightTotal = 0;
  for (let joint = 0; joint < JOINTS.length; joint++) {
    const offset = joint * 4;
    const weight = Math.min(first[offset + 3], second[offset + 3]) * JOINT_WEIGHTS[joint];
    if (weight < .15) continue;
    for (let axis = 0; axis < 3; axis++) {
      const poseDelta = first[offset + axis] - second[offset + axis];
      const motionDelta = firstMotion[offset + axis] - secondMotion[offset + axis];
      poseTotal += poseDelta * poseDelta * weight;
      motionTotal += motionDelta * motionDelta * weight;
    }
    weightTotal += weight * 3;
  }
  if (!weightTotal) return 4;
  return Math.sqrt(poseTotal / weightTotal) * .42 + Math.sqrt(motionTotal / weightTotal) * .58;
}

function dtwDistance(firstSequence, secondSequence) {
  const first = smoothSequence(resampleSequence(firstSequence));
  const second = smoothSequence(resampleSequence(secondSequence));
  if (!first.length || !second.length) return Infinity;
  const firstMotion = motionSequence(first);
  const secondMotion = motionSequence(second);
  const rows = first.length;
  const columns = second.length;
  const band = Math.max(5, Math.abs(rows - columns) + 4);
  const previous = new Float64Array(columns + 1).fill(Infinity);
  previous[0] = 0;
  for (let row = 1; row <= rows; row++) {
    const current = new Float64Array(columns + 1).fill(Infinity);
    const start = Math.max(1, row - band);
    const end = Math.min(columns, row + band);
    for (let column = start; column <= end; column++) {
      const cost = frameDistance(
        first[row - 1], second[column - 1],
        firstMotion[row - 1], secondMotion[column - 1]
      );
      current[column] = cost + Math.min(previous[column], current[column - 1], previous[column - 1]);
    }
    previous.set(current);
  }
  return previous[columns] / (rows + columns);
}

function singlePoseDistance(frame, sequence) {
  const mirrored = mirrorFrame(frame);
  let best = Infinity;
  sequence.forEach(candidate => {
    const stillMotion = new Array(frame.length).fill(0);
    best = Math.min(
      best,
      frameDistance(frame, candidate, stillMotion, stillMotion),
      frameDistance(mirrored, candidate, stillMotion, stillMotion)
    );
  });
  return best;
}

export async function ensurePoseEngine(mode = "VIDEO", numPoses = 1) {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(WASM_URL);
      const options = {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: .28,
        minPosePresenceConfidence: .28,
        minTrackingConfidence: .35,
        outputSegmentationMasks: false
      };
      try {
        return await PoseLandmarker.createFromOptions(vision, options);
      } catch {
        options.baseOptions.delegate = "CPU";
        return PoseLandmarker.createFromOptions(vision, options);
      }
    })();
  }
  const landmarker = await landmarkerPromise;
  if (activeMode !== mode || activeNumPoses !== numPoses) {
    await landmarker.setOptions({ runningMode: mode, numPoses });
    activeMode = mode;
    activeNumPoses = numPoses;
  }
  return landmarker;
}

function poseBox(landmarks) {
  const visible = (landmarks || []).filter(point => (point.visibility ?? 1) >= .35);
  if (visible.length < 8) return null;
  const left = Math.max(0, Math.min(...visible.map(point => point.x)));
  const right = Math.min(1, Math.max(...visible.map(point => point.x)));
  const top = Math.max(0, Math.min(...visible.map(point => point.y)));
  const bottom = Math.min(1, Math.max(...visible.map(point => point.y)));
  const hipX = ((landmarks[23]?.x ?? (left + right) / 2) + (landmarks[24]?.x ?? (left + right) / 2)) / 2;
  const hipY = ((landmarks[23]?.y ?? (top + bottom) / 2) + (landmarks[24]?.y ?? (top + bottom) / 2)) / 2;
  return {
    left, right, top, bottom,
    width: Math.max(.01, right - left),
    height: Math.max(.01, bottom - top),
    center: { x: hipX, y: hipY }
  };
}

function drawVideoFrame(video, maxSize = 760) {
  const scale = Math.min(1, maxSize / Math.max(video.videoWidth, video.videoHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
  canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
  canvas.getContext("2d", { alpha: false }).drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function remapCropLandmarks(landmarks, crop) {
  return landmarks.map(point => ({
    ...point,
    x: crop.x + point.x * crop.width,
    y: crop.y + point.y * crop.height,
    z: (point.z ?? 0) * crop.width
  }));
}

function cropFrameCanvas(frame, crop, maxSize = 760) {
  const sourceWidth = Math.max(1, Math.round(frame.width * crop.width));
  const sourceHeight = Math.max(1, Math.round(frame.height * crop.height));
  const scale = Math.min(2, maxSize / Math.max(sourceWidth, sourceHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sourceWidth * scale));
  canvas.height = Math.max(1, Math.round(sourceHeight * scale));
  canvas.getContext("2d", { alpha: false }).drawImage(
    frame,
    Math.round(frame.width * crop.x), Math.round(frame.height * crop.y),
    sourceWidth, sourceHeight,
    0, 0, canvas.width, canvas.height
  );
  return canvas;
}

function boxOverlap(first, second) {
  const left = Math.max(first.left, second.left);
  const right = Math.min(first.right, second.right);
  const top = Math.max(first.top, second.top);
  const bottom = Math.min(first.bottom, second.bottom);
  const intersection = Math.max(0, right - left) * Math.max(0, bottom - top);
  const smallerArea = Math.max(.0001, Math.min(first.width * first.height, second.width * second.height));
  return intersection / smallerArea;
}

function mergeDetectedPeople(detections) {
  const merged = [];
  detections
    .sort((a, b) => b.quality - a.quality)
    .forEach(candidate => {
      const duplicate = merged.find(person => {
        const centerDistance = Math.hypot(
          person.box.center.x - candidate.box.center.x,
          person.box.center.y - candidate.box.center.y
        );
        const scale = Math.max(.05, (person.box.height + candidate.box.height) / 2);
        return boxOverlap(person.box, candidate.box) > .34 || centerDistance / scale < .3;
      });
      if (!duplicate) merged.push(candidate);
    });
  return merged.sort((a, b) => a.box.center.y - b.box.center.y || a.box.center.x - b.box.center.x);
}

function bestSimultaneousPeople(detections) {
  const frames = new Map();
  detections.forEach(detection => {
    const key = Number(detection.detectedAt).toFixed(3);
    if (!frames.has(key)) frames.set(key, []);
    frames.get(key).push(detection);
  });
  return [...frames.entries()]
    .map(([key, frameDetections]) => ({
      time: Number(key),
      people: mergeDetectedPeople(frameDetections)
    }))
    .sort((a, b) => b.people.length - a.people.length || a.time - b.time)[0] || { time: 0, people: [] };
}

function densePeopleCrops() {
  const crops = [{ x: 0, y: 0, width: 1, height: 1, kind: "dense-full" }];
  [
    { columns: 4, rows: 1, width: .42, height: 1, prefix: "vertical" },
    { columns: 3, rows: 2, width: .5, height: .62, prefix: "row" }
  ].forEach(group => {
    for (let row = 0; row < group.rows; row++) {
      for (let column = 0; column < group.columns; column++) {
        const x = column * (1 - group.width) / Math.max(1, group.columns - 1);
        const y = row * (1 - group.height) / Math.max(1, group.rows - 1);
        crops.push({ x, y, width: group.width, height: group.height, kind: `${group.prefix}-${row}-${column}` });
      }
    }
  });
  return crops;
}

async function scanPeopleAtTimes(video, landmarker, times, crops, options, firstFrameRef, pass) {
  const detections = [];
  for (const [timeIndex, time] of times.entries()) {
    await options.seek(video, time);
    await new Promise(resolve => setTimeout(resolve, pass === 1 ? 36 : 24));
    const frame = drawVideoFrame(video, pass === 1 ? 960 : 1280);
    if (!firstFrameRef.current) firstFrameRef.current = frame;
    firstFrameRef.frames?.set(Number(time).toFixed(3), frame);
    for (const crop of crops) {
      const input = crop.kind === "full" || crop.kind === "dense-full" ? frame : cropFrameCanvas(frame, crop, 900);
      const result = landmarker.detect(input);
      (result.landmarks || []).forEach(landmarks => {
        const remapped = input === frame ? landmarks : remapCropLandmarks(landmarks, crop);
        const box = poseBox(remapped);
        if (!box) return;
        const visibleCount = remapped.filter(point => (point.visibility ?? 1) >= .2).length;
        detections.push({
          box,
          landmarks: remapped,
          quality: visibleCount + box.height * 3 - timeIndex * .04 - (pass - 1) * .03,
          detectedAt: time,
          detectedFrom: crop.kind,
          pass
        });
      });
    }
  }
  return detections;
}

export async function detectVideoPeople(video, options = {}) {
  const landmarker = await ensurePoseEngine("IMAGE", 12);
  if (video.readyState < 2) {
    await new Promise((resolve, reject) => {
      video.addEventListener("loadeddata", resolve, { once: true });
      video.addEventListener("error", reject, { once: true });
      video.load();
    });
  }
  const requestedTime = Math.min(Math.max(options.time ?? 0, 0), Math.max(video.duration - .05, 0));
  const earlyTimes = [...new Set([
    requestedTime,
    Math.min(requestedTime + .06, Math.max(video.duration - .05, 0)),
    Math.min(requestedTime + .13, Math.max(video.duration - .05, 0)),
    Math.min(requestedTime + .22, Math.max(video.duration - .05, 0)),
    Math.min(requestedTime + .34, Math.max(video.duration - .05, 0))
  ].map(value => +value.toFixed(3)))];
  const crops = [
    { x: 0, y: 0, width: 1, height: 1, kind: "full" },
    { x: 0, y: 0, width: .58, height: 1, kind: "left" },
    { x: .21, y: 0, width: .58, height: 1, kind: "center" },
    { x: .42, y: 0, width: .58, height: 1, kind: "right" },
    { x: 0, y: 0, width: .58, height: .72, kind: "back-left" },
    { x: .21, y: 0, width: .58, height: .72, kind: "back-center" },
    { x: .42, y: 0, width: .58, height: .72, kind: "back-right" },
    { x: 0, y: .28, width: .58, height: .72, kind: "front-left" },
    { x: .21, y: .28, width: .58, height: .72, kind: "front-center" },
    { x: .42, y: .28, width: .58, height: .72, kind: "front-right" }
  ];
  const firstFrameRef = { current: null, frames: new Map() };
  const primaryDetections = await scanPeopleAtTimes(video, landmarker, earlyTimes, crops, options, firstFrameRef, 1);
  let detections = primaryDetections;
  let bestFrame = bestSimultaneousPeople(detections);
  let people = bestFrame.people;
  let retry = null;
  if (people.length < 4) {
    const retryWindow = Math.min(Math.max(video.duration - .05, 0), Math.max(1.15, requestedTime + 1.15));
    const retryTimes = Array.from({ length: 8 }, (_, index) =>
      +(requestedTime + (retryWindow - requestedTime) * index / 7).toFixed(3)
    );
    const retryDetections = await scanPeopleAtTimes(video, landmarker, retryTimes, densePeopleCrops(), options, firstFrameRef, 2);
    detections = [...detections, ...retryDetections];
    bestFrame = bestSimultaneousPeople(detections);
    people = bestFrame.people;
    retry = {
      performed: true,
      firstPassPeople: bestSimultaneousPeople(primaryDetections).people.length,
      scannedTimes: retryTimes,
      scannedRegions: densePeopleCrops().length
    };
  }
  people = people.map((person, index) => ({ ...person, index }));
  return {
    frameDataUrl: (firstFrameRef.frames.get(bestFrame.time.toFixed(3)) || firstFrameRef.current).toDataURL("image/jpeg", .84),
    people,
    scannedTimes: earlyTimes,
    retry,
    acceptance: {
      requiredPeople: 4,
      detectedPeople: people.length,
      passed: people.length >= 4,
      retryPerformed: Boolean(retry)
    }
  };
}

function poseMotion(previous, current, bodyHeight = .4) {
  if (!previous?.length || !current?.length) return 0;
  const joints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
  const values = joints.map(index => {
    const first = previous[index];
    const second = current[index];
    if (!first || !second || Math.min(first.visibility ?? 1, second.visibility ?? 1) < .3) return 0;
    return Math.hypot(second.x - first.x, second.y - first.y) / Math.max(.08, bodyHeight);
  });
  return average(values);
}

function clampCrop(value, size) {
  return Math.max(0, Math.min(1 - size, value));
}

function teacherCropFromTrack(track, video) {
  const boxes = track.captures.map(capture => capture.box);
  const centerX = average(boxes.map(box => box.center.x));
  const centerY = average(boxes.map(box => (box.top + box.bottom) / 2));
  const bodyHeight = Math.max(.38, Math.min(.92, average(boxes.map(box => box.height)) * 1.5));
  const sourceRatio = video.videoHeight / Math.max(1, video.videoWidth);
  const width = Math.max(.22, Math.min(.72, bodyHeight * .72 * sourceRatio));
  const height = Math.max(.42, Math.min(.96, bodyHeight));
  return {
    x: clampCrop(centerX - width / 2, width),
    y: clampCrop(centerY - height / 2, height),
    width,
    height
  };
}

function teacherFrameDataUrl(frame, crop) {
  const output = document.createElement("canvas");
  output.width = 480;
  output.height = 640;
  output.getContext("2d", { alpha: false }).drawImage(
    frame,
    Math.round(frame.width * crop.x), Math.round(frame.height * crop.y),
    Math.round(frame.width * crop.width), Math.round(frame.height * crop.height),
    0, 0, output.width, output.height
  );
  return output.toDataURL("image/jpeg", .86);
}

export async function identifyTeacherCandidates(video, options = {}) {
  const initialPeople = Array.isArray(options.people) ? options.people.slice(0, 12) : [];
  if (!initialPeople.length) return { candidates: [], selected: null, needsConfirmation: true };
  const landmarker = await ensurePoseEngine("IMAGE", 12);
  const analysisDuration = Math.min(Math.max(video.duration || 0, .1), 45);
  const sampleCount = Math.min(26, Math.max(14, Math.round(analysisDuration * .75)));
  const times = Array.from({ length: sampleCount }, (_, index) =>
    analysisDuration * (.02 + .96 * index / Math.max(1, sampleCount - 1))
  );
  const tracks = initialPeople.map(person => ({
    personIndex: person.index,
    lastCenter: person.box.center,
    captures: [],
    motions: []
  }));
  let bestFrame = null;
  let bestFrameTime = 0;

  for (const time of times) {
    await options.seek(video, time);
    await new Promise(resolve => setTimeout(resolve, 24));
    const frame = drawVideoFrame(video, 960);
    const result = landmarker.detect(frame);
    const detections = (result.landmarks || []).map(landmarks => ({ landmarks, box: poseBox(landmarks) })).filter(item => item.box);
    const available = new Set(detections.map((_, index) => index));
    tracks.forEach(track => {
      const ranked = [...available].map(index => ({
        index,
        distance: Math.hypot(
          detections[index].box.center.x - track.lastCenter.x,
          detections[index].box.center.y - track.lastCenter.y
        )
      })).sort((a, b) => a.distance - b.distance);
      const match = ranked[0];
      if (!match || match.distance > .28) return;
      const detection = detections[match.index];
      available.delete(match.index);
      const previous = track.captures.at(-1);
      const motion = poseMotion(previous?.landmarks, detection.landmarks, detection.box.height);
      track.captures.push({ time, ...detection, frame });
      track.motions.push({ time, value: motion });
      track.lastCenter = detection.box.center;
      if (motion >= Math.max(...tracks.flatMap(item => item.motions.map(entry => entry.value)), 0)) {
        bestFrame = frame;
        bestFrameTime = time;
      }
    });
  }

  const candidates = tracks.filter(track => track.captures.length >= 3).map(track => {
    const coverage = track.captures.length / times.length;
    const prominence = average(track.captures.map(capture => capture.box.height));
    const centrality = 1 - Math.min(1, average(track.captures.map(capture =>
      Math.hypot(capture.box.center.x - .5, capture.box.center.y - .52)
    )) / .7);
    const movement = average([...track.motions].sort((a, b) => b.value - a.value).slice(0, 6).map(entry => entry.value));
    const score = coverage * .42 + Math.min(1, prominence / .72) * .24 + centrality * .2 + Math.min(1, movement / .18) * .14;
    const peak = [...track.motions].sort((a, b) => b.value - a.value)[0] || { time: 0, value: 0 };
    const segmentDuration = Math.min(6, Math.max(2.5, video.duration || 0));
    const segmentStart = Math.max(0, Math.min((video.duration || 0) - segmentDuration, peak.time - segmentDuration * .38));
    const crop = teacherCropFromTrack(track, video);
    const frameCapture = track.captures.reduce((best, capture) =>
      Math.abs(capture.time - peak.time) < Math.abs(best.time - peak.time) ? capture : best,
      track.captures[0]
    );
    return {
      personIndex: track.personIndex,
      score,
      coverage,
      prominence,
      centrality,
      movement,
      crop,
      segmentStart,
      segmentDuration,
      frameDataUrl: teacherFrameDataUrl(frameCapture?.frame || bestFrame, crop),
      evidence: `持续入镜 ${Math.round(coverage * 100)}% · 核心位置 ${Math.round(centrality * 100)}% · 示范活跃度 ${Math.round(Math.min(1, movement / .18) * 100)}%`
    };
  }).sort((a, b) => b.score - a.score);

  const selected = candidates[0] || null;
  return {
    candidates,
    selected,
    sampledTimes: times,
    peakFrameTime: bestFrameTime,
    needsConfirmation: !selected || selected.score < .62 || (candidates[1] && selected.score - candidates[1].score < .08)
  };
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function standardDeviation(values) {
  const mean = average(values);
  return Math.sqrt(average(values.map(value => (value - mean) ** 2)));
}

function movementMetrics(captures, requestedFrames) {
  const centers = captures.map(capture => capture.box.center);
  const heights = captures.map(capture => capture.box.height);
  const speeds = centers.slice(1).map((center, index) => {
    const previous = centers[index];
    return Math.hypot(center.x - previous.x, center.y - previous.y) / Math.max(.08, heights[index]);
  });
  const meanSpeed = average(speeds);
  const sortedSpeeds = [...speeds].sort((a, b) => a - b);
  const medianSpeed = sortedSpeeds[Math.floor(sortedSpeeds.length / 2)] || 0;
  const leftReach = captures.map(({ landmarks }) => Math.hypot(
    (landmarks[15]?.x ?? 0) - (landmarks[11]?.x ?? 0),
    (landmarks[15]?.y ?? 0) - (landmarks[11]?.y ?? 0)
  ));
  const rightReach = captures.map(({ landmarks }) => Math.hypot(
    (landmarks[16]?.x ?? 0) - (landmarks[12]?.x ?? 0),
    (landmarks[16]?.y ?? 0) - (landmarks[12]?.y ?? 0)
  ));
  const leftLegReach = captures.map(({ landmarks }) => Math.hypot(
    (landmarks[27]?.x ?? 0) - (landmarks[23]?.x ?? 0),
    (landmarks[27]?.y ?? 0) - (landmarks[23]?.y ?? 0)
  ));
  const rightLegReach = captures.map(({ landmarks }) => Math.hypot(
    (landmarks[28]?.x ?? 0) - (landmarks[24]?.x ?? 0),
    (landmarks[28]?.y ?? 0) - (landmarks[24]?.y ?? 0)
  ));
  const xValues = centers.map(center => center.x);
  const yValues = centers.map(center => center.y);
  const minX = xValues.length ? Math.min(...xValues) : 0;
  const maxX = xValues.length ? Math.max(...xValues) : 1;
  const minY = yValues.length ? Math.min(...yValues) : 0;
  const maxY = yValues.length ? Math.max(...yValues) : 1;
  const widths = captures.map(capture => capture.box.width);
  return {
    coverage: captures.length / Math.max(1, requestedFrames),
    capturedFrames: captures.length,
    requestedFrames,
    horizontalRange: xValues.length ? (Math.max(...xValues) - Math.min(...xValues)) / Math.max(.08, average(heights)) : 0,
    verticalRange: yValues.length ? (Math.max(...yValues) - Math.min(...yValues)) / Math.max(.08, average(heights)) : 0,
    speedVariation: meanSpeed ? standardDeviation(speeds) / meanSpeed : 0,
    pauseRatio: speeds.length ? speeds.filter(speed => speed < medianSpeed * .22).length / speeds.length : 0,
    armRangeBalance: Math.min(average(leftReach), average(rightReach)) / Math.max(.01, Math.max(average(leftReach), average(rightReach))),
    legRangeBalance: Math.min(average(leftLegReach), average(rightLegReach)) / Math.max(.01, Math.max(average(leftLegReach), average(rightLegReach))),
    centerPath: centers.map(center => ({
      x: (center.x - minX) / Math.max(.01, maxX - minX),
      y: (center.y - minY) / Math.max(.01, maxY - minY)
    })),
    speedSeries: speeds.slice(0, 48),
    bodyWidthMean: average(widths),
    bodyHeightMean: average(heights),
    bodyWidthPeak: widths.length ? Math.max(...widths) : 0,
    bodyHeightPeak: heights.length ? Math.max(...heights) : 0
  };
}

export async function extractVideoPersonTrajectory(video, options = {}) {
  const landmarker = await ensurePoseEngine("IMAGE", 6);
  const start = Math.max(0, options.start || 0);
  const duration = Math.max(.1, Math.min(options.duration || video.duration, video.duration - start));
  const sampleCount = Math.max(12, options.sampleCount || 36);
  const times = Array.from({ length: sampleCount }, (_, index) =>
    start + duration * (.025 + .95 * index / Math.max(sampleCount - 1, 1))
  );
  let targetCenter = options.referenceCenter || { x: .5, y: .5 };
  const sequence = [];
  const captures = [];
  for (let index = 0; index < times.length; index++) {
    await options.seek(video, times[index]);
    await new Promise(resolve => setTimeout(resolve, 20));
    const canvas = drawVideoFrame(video, 640);
    const result = landmarker.detect(canvas);
    const candidates = (result.landmarks || []).map((landmarks, poseIndex) => ({
      poseIndex,
      landmarks,
      box: poseBox(landmarks)
    })).filter(candidate => candidate.box);
    const selected = candidates.sort((a, b) =>
      Math.hypot(a.box.center.x - targetCenter.x, a.box.center.y - targetCenter.y) -
      Math.hypot(b.box.center.x - targetCenter.x, b.box.center.y - targetCenter.y)
    )[0];
    if (selected && Math.hypot(selected.box.center.x - targetCenter.x, selected.box.center.y - targetCenter.y) < .38) {
      const frame = poseFrameFromResult(result, selected.poseIndex);
      if (frame) {
        targetCenter = selected.box.center;
        sequence.push(frame);
        captures.push({ time: times[index], landmarks: selected.landmarks, box: selected.box });
      }
    }
    options.onProgress?.(index + 1, times.length, sequence.length);
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  return { sequence, captures, metrics: movementMetrics(captures, times.length), requestedFrames: times.length };
}

export async function extractVideoPoseSequence(video, options = {}) {
  // Detect every sampled frame independently. The ordered frames below still form
  // a continuous trajectory, while avoiding tracker state leaking across clips.
  const landmarker = await ensurePoseEngine("IMAGE");
  if (video.readyState < 2) {
    await new Promise((resolve, reject) => {
      video.addEventListener("loadeddata", resolve, { once: true });
      video.addEventListener("error", reject, { once: true });
      video.load();
    });
  }
  const start = Math.max(0, options.start || 0);
  const duration = Math.max(.1, Math.min(options.duration || video.duration, video.duration - start));
  const sampleCount = Math.max(8, options.sampleCount || TARGET_FRAMES);
  const times = Array.from({ length: sampleCount }, (_, index) =>
    start + duration * (.04 + .92 * index / Math.max(sampleCount - 1, 1))
  );
  const sequence = [];
  const captures = [];
  const frameCanvas = document.createElement("canvas");
  const frameScale = Math.min(1, 640 / Math.max(video.videoWidth, video.videoHeight));
  frameCanvas.width = Math.max(1, Math.round(video.videoWidth * frameScale));
  frameCanvas.height = Math.max(1, Math.round(video.videoHeight * frameScale));
  const frameContext = frameCanvas.getContext("2d", { alpha: false });
  for (let index = 0; index < times.length; index++) {
    await options.seek(video, times[index]);
    await new Promise(resolve => setTimeout(resolve, 24));
    frameContext.drawImage(video, 0, 0, frameCanvas.width, frameCanvas.height);
    const result = landmarker.detect(frameCanvas);
    const frame = poseFrameFromResult(result);
    if (frame) {
      sequence.push(frame);
      captures.push({ time: times[index], landmarks: result.landmarks?.[0] || null });
    }
    options.onProgress?.(index + 1, times.length, sequence.length);
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  return { sequence, captures, requestedFrames: times.length };
}

export async function extractImagePose(image) {
  const landmarker = await ensurePoseEngine("IMAGE");
  const result = landmarker.detect(image);
  return {
    frame: poseFrameFromResult(result),
    landmarks: result.landmarks?.[0] || null
  };
}

export function comparePoseQuery(querySequence, library, options = {}) {
  const isSingleFrame = options.singleFrame || querySequence.length === 1;
  const mirrored = querySequence.map(mirrorFrame);
  const matches = library.items.map(entry => {
    const distance = isSingleFrame
      ? singlePoseDistance(querySequence[0], entry.sequence)
      : Math.min(dtwDistance(querySequence, entry.sequence), dtwDistance(mirrored, entry.sequence));
    return { id: entry.id, distance, score: 1 / (1 + distance * 5) };
  }).sort((first, second) => first.distance - second.distance);
  const top = matches[0]?.distance ?? Infinity;
  const margin = (matches[1]?.distance ?? Infinity) - top;
  return {
    matches: matches.slice(0, 5),
    assessment: {
      confident: !isSingleFrame && top < .115 && margin > .008,
      singleFrame: isSingleFrame,
      top,
      margin
    }
  };
}

export function drawPose(canvas, landmarks, media) {
  if (!landmarks?.length) {
    canvas.hidden = true;
    return;
  }
  const connections = [
    [11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],
    [23,25],[25,27],[27,29],[29,31],[27,31],[24,26],[26,28],[28,30],[30,32],[28,32]
  ];
  const width = canvas.clientWidth || canvas.parentElement.clientWidth;
  const height = canvas.clientHeight || canvas.parentElement.clientHeight;
  const scale = devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext("2d");
  context.scale(scale, scale);
  context.clearRect(0, 0, width, height);
  const mediaWidth = media?.videoWidth || media?.naturalWidth || width;
  const mediaHeight = media?.videoHeight || media?.naturalHeight || height;
  const fit = Math.min(width / mediaWidth, height / mediaHeight);
  const contentWidth = mediaWidth * fit;
  const contentHeight = mediaHeight * fit;
  const offsetX = (width - contentWidth) / 2;
  const offsetY = (height - contentHeight) / 2;
  const point = landmark => ({
    x: offsetX + landmark.x * contentWidth,
    y: offsetY + landmark.y * contentHeight
  });
  context.strokeStyle = "rgba(255,255,255,.86)";
  context.fillStyle = "#b3261e";
  context.lineWidth = 1.5;
  connections.forEach(([from, to]) => {
    if ((landmarks[from]?.visibility ?? 1) < .35 || (landmarks[to]?.visibility ?? 1) < .35) return;
    const first = point(landmarks[from]);
    const second = point(landmarks[to]);
    context.beginPath();
    context.moveTo(first.x, first.y);
    context.lineTo(second.x, second.y);
    context.stroke();
  });
  JOINTS.forEach(index => {
    if ((landmarks[index]?.visibility ?? 1) < .35) return;
    const target = point(landmarks[index]);
    context.beginPath();
    context.arc(target.x, target.y, 2.8, 0, Math.PI * 2);
    context.fill();
  });
  canvas.hidden = false;
}

