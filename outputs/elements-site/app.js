const names = [
  "Running Man","BK Bounce","Crab","Happy Feet","Patty Duke","Yeek","Kick","Party Machine","Walk it Out","Walk Out",
  "Prep","Wu-Tang","The Wop","The Box Step","The Camel Walk","Sponge Bob","Typewriter","ATL Stomp","Reject","Jerk",
  "Charleston","Kid 'N Play","TLC","Biz Markie","Janet Jackson","James Brown","LL Cool J","Jerry Lewis","Marge Step","Upstairs Downstairs",
  "Toss it Up","Let it Rain","Chicken Noodle Soup","Getting Lite","Steve Martin","Reebok","Cabbage Patch","Gucci","Skate","The Humpty Dance",
  "Stomp","Popcorn","Rock Off","Shamrock","Guess","Smurf","Rooftop","Funky 4 Corners","Cat Daddy","Roger Rabbit",
  "Baseball Step","Monastery","Mike Tyson","Gigolo","Badman","Robocop","Bart Simpson","Pepper Seed","The Fila","The ALF",
  "Harlem Shake","Bankhead Bounce","Superman","Horse Dance","Heel Toe","Crazy Legs","Creep","Dougie","C-Walk","Aunt Jackie",
  "Arm Wave","Body Wave","Snake","Stick&Roll","Water Dance","Butterfly","Funky Water Gate","Cherry Hill","Dipin","Side Glide",
  "Indian Step","Diddy Bop","Diddy Dance","Roller Skate","Mary J","Brooklyn","Bedrock"
];

const interval = 4.9;
const masterClip = "assets/master/hiphop-elements-borderless-master.mp4";
const handElements = new Set([
  "Wu-Tang","Party Machine","Prep","Toss it Up","Let it Rain","Getting Lite","Guess","Smurf",
  "Funky 4 Corners","Cat Daddy","Roger Rabbit","Superman","Creep","Dougie","Aunt Jackie",
  "Arm Wave","Body Wave","Snake","Stick&Roll","Water Dance","Butterfly","Funky Water Gate","Dipin"
]);
const publicNotes = {
  "Walk it Out": {
    text: "动作背景：Walk It Out 在 2000 年代初的地下 Hip-Hop 舞蹈场景中流行，并因说唱歌手 Unk 2006 年的同名歌曲进一步传播；确切创作者未明。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/hip-hop-dance-move-walk-it-out"
  },
  "Stomp": {
    text: "动作背景：该站将 Stomping 的脉络追溯至 1970 年代早期 Hip-Hop 文化，并描述它后来进入 Breaking、Locking 与 Popping 等舞蹈语汇。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/hip-hop-dance-move-stomping"
  },
  "Steve Martin": {
    text: "动作背景：Steve Martin 由康涅狄格州 Hip-Hop 舞者兼说唱歌手 Stezo 在 1980 年代末创造，名称致意喜剧演员 Steve Martin。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/steve-martin-dance"
  },
  "Smurf": {
    text: "动作背景：该站认为 Smurf 可能由 1960 年代舞步 The Frug 演变而来，两者具有相似的弹跳与手臂动作。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/hip-hop-dance-move-smurf"
  },
  "Running Man": {
    text: "动作背景：Running Man 的确切起源尚不明确；该站称其普遍被认为来自 1980 年代末新泽西的 Hip-Hop 舞团，并通过 MC Hammer、Bobby Brown 等艺人的影像与演出走向主流。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/hip-hop-dance-move-running-man"
  },
  "Roger Rabbit": {
    text: "动作背景：Roger Rabbit 于 1980 年代末流行，受到 1988 年电影《谁陷害了兔子罗杰》中角色夸张、松弛动作的启发；确切创作者尚不明确。",
    source: "DanceWithCeech",
    url: "https://dancewithceech.com/blog/hip-hop-dance-move-roger-rabbit"
  },
  "Prep": {
    text: "动作背景：Prep 兴起于 1990 年代 Hip-Hop 场景，动作意象来自出门前照镜子、掸去衣服灰尘等整理仪表的日常准备。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/hip-hop-dance-move-prep"
  },
  "Pepper Seed": {
    text: "动作背景：该站称 Pepperseed 在 2000 年代初于洛杉矶 Hip-Hop 场景流行，随后传播至其他地区；确切起源尚不明确。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/hip-hop-dance-move-pepperseed"
  },
  "Party Machine": {
    text: "动作背景：Party Machine 的确切起源尚不明确；该站称它在 2010 年代末的 Hip-Hop 场景广泛流行，并常见于 Battle、Cypher 与编舞。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/hip-hop-dance-move-party-machine"
  },
  "Monastery": {
    text: "动作背景：Monastery 在 2000 年代初从美国密苏里州圣路易斯的 Hip-Hop 舞蹈场景中流行起来，并传播到其他地区。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/hip-hop-dance-move-monastery"
  },
  "Heel Toe": {
    text: "动作背景：该站将 Heel Toe 描述为源自 Reggae、经由 House Dance 进入 Hip-Hop 的动作，并指出它与 James Brown 舞步相近。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/heel-toe"
  },
  "Harlem Shake": {
    text: "动作背景：Harlem Shake 于 1980 年代初起源于纽约 Harlem；该站将其创作归于当地舞者 Al B。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/harlem-shake"
  },
  "Happy Feet": {
    text: "动作背景：该站把 Happy Feet 描述为较新的 Hip-Hop Footwork，在 2000 年代流行，并受到 Old School 动作与聚会舞蹈的多重影响。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/happy-feet"
  },
  "The Fila": {
    text: "动作背景：Fila 的名称来自在 Hip-Hop 与都市时尚中具有影响力的同名运动品牌；该站称这一动作在 20 世纪后期受到关注。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/fila-dance"
  },
  "Cabbage Patch": {
    text: "动作背景：Cabbage Patch 兴起于 1980 年代 Hip-Hop 黄金时期，名称来自当时流行的 Cabbage Patch Kids 玩偶；确切创作者未有定论。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/cabbage-patch"
  },
  "ATL Stomp": {
    text: "动作背景：ATL Stomp 源自亚特兰大，在 1990 年代末至 2000 年代初成为当地 Hip-Hop 与 Crunk 场景的代表性动作。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/mastering-the-atl-stomp-rhythm-of-the-south"
  },
  "C-Walk": {
    text: "动作背景：C-Walk 可追溯到 1970 年代早期洛杉矶 Crip 社群，至 1990 年代末和 2000 年代初进入更广泛的 Hip-Hop 场景。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/c-walk"
  },
  "Butterfly": {
    text: "动作背景：Butterfly 在 1990 年代进入 Hip-Hop 场景；该站称其没有明确的单一创作者，并通过俱乐部、舞池与音乐录像传播。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/butterfly"
  },
  "BK Bounce": {
    text: "动作背景：BK Bounce 出自布鲁克林地下舞蹈场景，并在 1990 年代流行；该站的资料同时提到舞者 Buddha Stretch。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/bk-bounce"
  },
  "Bart Simpson": {
    text: "动作背景：Bart Simpson 形成于 1990 年代初《辛普森一家》广受欢迎的时期，体现当时舞者从流行媒体人物中取材的创作方式。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/bart-simpson"
  },
  "Bankhead Bounce": {
    text: "动作背景：Bankhead Bounce 于 1990 年代初兴起于美国亚特兰大 Bankhead 社区，并因 D-Roc 1995 年的同名作品进一步传播。",
    source: "DanceWithCeech", url: "https://dancewithceech.com/blog/bankhead-bounce"
  }
};
const elements = names.map((name, index) => ({
  id: index + 1,
  name,
  start: +(index * interval).toFixed(2),
  duration: interval,
  poster: `assets/posters-black/element-${String(index + 1).padStart(2, "0")}.jpg`,
  clip: masterClip,
  category: handElements.has(name) ? "hand" : "foot"
}));

const grid = document.querySelector("#grid");
const template = document.querySelector("#cardTemplate");
const searchInput = document.querySelector("#searchInput");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const clearSearch = document.querySelector("#clearSearch");
const dailyTrack = document.querySelector("#dailyTrack");
const filterButtons = document.querySelectorAll(".filter-btn");
const prototypeTrack = document.querySelector("#prototypeTrack");
const motionViewer = document.querySelector("#motionViewer");
const viewerPanel = document.querySelector("#viewerPanel");
const viewerVideo = document.querySelector("#viewerVideo");
const practiceForm = document.querySelector("#practiceForm");
const practiceMoveEditors = document.querySelector("#practiceMoveEditors");
const dailySelectionCount = document.querySelector("#dailySelectionCount");
const dailySelectionHint = document.querySelector("#dailySelectionHint");
const clearDailySelection = document.querySelector("#clearDailySelection");
const variationPracticeQueueCount = document.querySelector("#variationPracticeQueueCount");
const variationPracticeQueueList = document.querySelector("#variationPracticeQueueList");
const practiceRecordList = document.querySelector("#practiceRecordList");
const practiceRecordCount = document.querySelector("#practiceRecordCount");
const backupPracticeRecords = document.querySelector("#backupPracticeRecords");
const practiceBackupStatus = document.querySelector("#practiceBackupStatus");
const practiceSaveStatus = document.querySelector("#practiceSaveStatus");
const practiceFormTitle = document.querySelector("#practiceFormTitle");
const practiceFormDescription = document.querySelector("#practiceFormDescription");
const savePracticeRecord = document.querySelector("#savePracticeRecord");
const cancelPracticeEdit = document.querySelector("#cancelPracticeEdit");
const practiceDate = document.querySelector("#practiceDate");
const practiceMoveSelect = document.querySelector("#practiceMoveSelect");
const addPracticeMove = document.querySelector("#addPracticeMove");
const practiceMoveEmpty = document.querySelector("#practiceMoveEmpty");
const practiceVoiceTranscript = document.querySelector("#practiceVoiceTranscript");
const practiceVoiceButton = document.querySelector("#practiceVoiceButton");
const practiceVoiceStatus = document.querySelector("#practiceVoiceStatus");
const applyPracticeVoice = document.querySelector("#applyPracticeVoice");
const practiceDouyinVideo = document.querySelector("#practiceDouyinVideo");
const pickPracticeDouyinVideo = document.querySelector("#pickPracticeDouyinVideo");
const pastePracticeDouyinVideo = document.querySelector("#pastePracticeDouyinVideo");
const removePracticeDouyinVideo = document.querySelector("#removePracticeDouyinVideo");
const practiceDouyinMeta = document.querySelector("#practiceDouyinMeta");
const practiceVideoExtraction = document.querySelector("#practiceVideoExtraction");
const practiceDouyinPreview = document.querySelector("#practiceDouyinPreview");
const classAnalysisForm = document.querySelector("#classAnalysisForm");
const classAnalysisCount = document.querySelector("#classAnalysisCount");
const classAnalysisList = document.querySelector("#classAnalysisList");
const classAnalysisStatus = document.querySelector("#classAnalysisStatus");
const classAnalysisResult = document.querySelector("#classAnalysisResult");
const classAnalysisModel = document.querySelector("#classAnalysisModel");
const classTitle = document.querySelector("#classTitle");
const classDate = document.querySelector("#classDate");
const classTeacher = document.querySelector("#classTeacher");
const classTeacherNewField = document.querySelector("#classTeacherNewField");
const classTeacherNew = document.querySelector("#classTeacherNew");
const forgetClassTeacher = document.querySelector("#forgetClassTeacher");
const classVideoFile = document.querySelector("#classVideoFile");
const pickClassVideo = document.querySelector("#pickClassVideo");
const pasteClassVideo = document.querySelector("#pasteClassVideo");
const removeClassVideo = document.querySelector("#removeClassVideo");
const classVideoMeta = document.querySelector("#classVideoMeta");
const classVideoPreview = document.querySelector("#classVideoPreview");
const classPersonPicker = document.querySelector("#classPersonPicker");
const classPersonFrame = document.querySelector("#classPersonFrame");
const classPersonChoices = document.querySelector("#classPersonChoices");
const classPersonStatus = document.querySelector("#classPersonStatus");
const retryClassPeople = document.querySelector("#retryClassPeople");
const classTeacherCut = document.querySelector("#classTeacherCut");
const classTeacherPresenceInputs = document.querySelectorAll('input[name="classTeacherPresence"]');
const classTeacherCutStatus = document.querySelector("#classTeacherCutStatus");
const classTeacherCandidates = document.querySelector("#classTeacherCandidates");
const classTeacherCutPreview = document.querySelector("#classTeacherCutPreview");
const classTeacherCutMeta = document.querySelector("#classTeacherCutMeta");
const regenerateTeacherCut = document.querySelector("#regenerateTeacherCut");
const teacherDemoVideoFile = document.querySelector("#teacherDemoVideoFile");
const pickTeacherDemoVideo = document.querySelector("#pickTeacherDemoVideo");
const removeTeacherDemoVideo = document.querySelector("#removeTeacherDemoVideo");
const teacherDemoVideoMeta = document.querySelector("#teacherDemoVideoMeta");
const classTranscript = document.querySelector("#classTranscript");
const transcribeClassVideo = document.querySelector("#transcribeClassVideo");
const classTranscriptionStatus = document.querySelector("#classTranscriptionStatus");
const analyzeClass = document.querySelector("#analyzeClass");
const discardClassAnalysis = document.querySelector("#discardClassAnalysis");
const classMovesResult = document.querySelector("#classMovesResult");
const classPointsResult = document.querySelector("#classPointsResult");
const classProblemsResult = document.querySelector("#classProblemsResult");
const classConfirmationsResult = document.querySelector("#classConfirmationsResult");
const classSummaryResult = document.querySelector("#classSummaryResult");
const classMoveCandidates = document.querySelector("#classMoveCandidates");
const classChatcutClips = document.querySelector("#classChatcutClips");
const classClipCandidates = document.querySelector("#classClipCandidates");
const classClipStatus = document.querySelector("#classClipStatus");
const classMovementEvidence = document.querySelector("#classMovementEvidence");
const classTrajectoryCanvas = document.querySelector("#classTrajectoryCanvas");
const classTextureCanvas = document.querySelector("#classTextureCanvas");
const classTrajectoryConfidence = document.querySelector("#classTrajectoryConfidence");
const classFrameConfidence = document.querySelector("#classFrameConfidence");
const classTextureConfidence = document.querySelector("#classTextureConfidence");
const classTrajectoryTitle = document.querySelector("#classTrajectoryTitle");
const classTrajectoryCopy = document.querySelector("#classTrajectoryCopy");
const classFrameTitle = document.querySelector("#classFrameTitle");
const classFrameCopy = document.querySelector("#classFrameCopy");
const classTextureTitle = document.querySelector("#classTextureTitle");
const classTextureCopy = document.querySelector("#classTextureCopy");
const classFrameVisual = document.querySelector("#classFrameVisual");
const classCoachSummary = document.querySelector("#classCoachSummary");
const classCoachFocus = document.querySelector("#classCoachFocus");
const replayWithFocus = document.querySelector("#replayWithFocus");
const classNoteCompanion = document.querySelector("#classNoteCompanion");
const classNoteCompanionCanvas = document.querySelector("#classNoteCompanionCanvas");
const classNoteCompanionName = document.querySelector("#classNoteCompanionName");
const dailyDateKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Shanghai" });
const dailyPickStorageKey = `hiphop-daily-picks-${dailyDateKey}`;
let selectedDailyIds = new Set(readDailyPicks());
let practiceMoveIds = new Set(selectedDailyIds);
let practiceMoveDrafts = new Map();
let selectedDouyinVideo = null;
let selectedDouyinPreviewUrl = "";
let editingPracticeSession = null;
let editingPracticeVideoChanged = false;
let practiceRecordVideoUrls = [];
let selectedClassVideo = null;
let selectedClassPreviewUrl = "";
let classRecordVideoUrls = [];
let awaitingClassVideoPaste = false;
let selectedClassPerson = null;
let classDetectedPeople = [];
let classPeopleAcceptance = null;
let classTeacherDetection = null;
let selectedClassTeacherCandidate = null;
let selectedTeacherDemoVideo = null;
let selectedTeacherDemoPreviewUrl = "";
let generatedTeacherCutBlob = null;
let generatedTeacherCutUrl = "";
let classMoveAnimationFrame = 0;
let elementCompanionAnimationFrame = 0;
let elementCompanionAnimations = [];
let lastClassVideoAnalysis = null;
let classClipDrafts = [];
let classVariationVideoUrls = [];
let classPersonDetectionPending = false;
let speechRecognition = null;
let activeVideo = null;
let activeCategory = "all";
let prototypeIndex = 0;
let prototypeOpener = null;
const companionPlaybackRate = .45;

function classTeacherPresence() {
  return document.querySelector('input[name="classTeacherPresence"]:checked')?.value || "";
}

function poseFrameDifference(first, second) {
  if (!first?.length || !second?.length) return 0;
  let total = 0;
  let weight = 0;
  for (let joint = 0; joint < 16; joint++) {
    const offset = joint * 4;
    const visibility = Math.min(first[offset + 3] || 0, second[offset + 3] || 0);
    if (visibility < .3) continue;
    total += Math.hypot(first[offset] - second[offset], first[offset + 1] - second[offset + 1]) * visibility;
    weight += visibility;
  }
  return weight ? total / weight : 0;
}

function selectCompanionKeyframes(sequence, target = 7) {
  if (!sequence?.length) return [];
  if (sequence.length <= target) return sequence.map((_, index) => index);
  const selected = new Set([0, sequence.length - 1]);
  while (selected.size < target) {
    let bestIndex = -1;
    let bestScore = -1;
    for (let index = 1; index < sequence.length - 1; index++) {
      if (selected.has(index) || [...selected].some(value => Math.abs(value - index) < 2)) continue;
      const poseNovelty = Math.min(...[...selected].map(value => poseFrameDifference(sequence[index], sequence[value])));
      const timeSpacing = Math.min(...[...selected].map(value => Math.abs(value - index))) / sequence.length;
      const curvature = poseFrameDifference(sequence[index - 1], sequence[index + 1]);
      const score = poseNovelty * 1.8 + curvature * .55 + timeSpacing * .16;
      if (score > bestScore) { bestScore = score; bestIndex = index; }
    }
    if (bestIndex < 0) break;
    selected.add(bestIndex);
  }
  return [...selected].sort((a, b) => a - b);
}

function strongestMovingJoint(first, second) {
  const expressiveJoints = [4, 5, 8, 9, 10, 11, 12, 13, 14, 15];
  let winner = 15;
  let distance = -1;
  expressiveJoints.forEach(joint => {
    const offset = joint * 4;
    if (Math.min(first?.[offset + 3] || 0, second?.[offset + 3] || 0) < .3) return;
    const current = Math.hypot(second[offset] - first[offset], second[offset + 1] - first[offset + 1]);
    if (current > distance) { distance = current; winner = joint; }
  });
  return winner;
}

function buildCompanionTimeline(sequence, sourceDuration = interval) {
  if (!sequence?.length) return null;
  const keyIndexes = selectCompanionKeyframes(sequence);
  const entries = [];
  keyIndexes.forEach((keyIndex, order) => {
    const previousKey = keyIndexes[Math.max(0, order - 1)];
    const nextKey = keyIndexes[Math.min(keyIndexes.length - 1, order + 1)];
    entries.push({
      frame: sequence[keyIndex],
      previousFrame: sequence[previousKey],
      accentJoint: strongestMovingJoint(sequence[previousKey], sequence[keyIndex]),
      weight: order === 0 || order === keyIndexes.length - 1 ? 2.35 : 1.75,
      keyPose: true
    });
    if (order >= keyIndexes.length - 1) return;
    const gap = nextKey - keyIndex;
    const breakdownIndex = Math.min(nextKey - 1, keyIndex + Math.max(1, Math.round(gap * .58)));
    if (breakdownIndex > keyIndex && breakdownIndex < nextKey) {
      entries.push({
        frame: sequence[breakdownIndex],
        previousFrame: sequence[keyIndex],
        accentJoint: strongestMovingJoint(sequence[keyIndex], sequence[nextKey]),
        weight: .72,
        keyPose: false
      });
    }
  });
  const duration = sourceDuration * 1000 / companionPlaybackRate;
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0) || 1;
  let cursor = 0;
  entries.forEach(entry => {
    entry.start = cursor;
    cursor += duration * entry.weight / totalWeight;
    entry.end = cursor;
  });
  return { entries, duration, keyIndexes };
}

function blendPoseFrames(first, second, amount) {
  if (!first?.length) return second;
  if (!second?.length) return first;
  const result = new Array(Math.min(first.length, second.length));
  for (let index = 0; index < result.length; index++) {
    result[index] = first[index] + (second[index] - first[index]) * amount;
  }
  return result;
}

function companionTimelineSample(timeline, elapsed) {
  if (!timeline?.entries?.length) return null;
  const position = ((elapsed % timeline.duration) + timeline.duration) % timeline.duration;
  const entry = timeline.entries.find(item => position < item.end) || timeline.entries.at(-1);
  const span = Math.max(1, entry.end - entry.start);
  const local = Math.max(0, Math.min(1, (position - entry.start) / span));
  const transitionShare = entry.keyPose ? .28 : .78;
  const rawTransition = Math.min(1, local / transitionShare);
  const eased = rawTransition * rawTransition * (3 - 2 * rawTransition);
  return {
    ...entry,
    frame: blendPoseFrames(entry.previousFrame, entry.frame, eased),
    settled: rawTransition >= 1
  };
}

function readDailyPicks() {
  try {
    const saved = JSON.parse(localStorage.getItem(dailyPickStorageKey) || "[]");
    return Array.isArray(saved) ? saved.slice(0, 3) : [];
  } catch {
    return [];
  }
}

function writeDailyPicks() {
  localStorage.setItem(dailyPickStorageKey, JSON.stringify([...selectedDailyIds]));
}

function stopVideo(video) {
  if (!video) return;
  video.pause();
  video.closest(".card")?.classList.remove("is-playing");
}

function createCard(item, options = {}) {
  const node = template.content.cloneNode(true);
  const card = node.querySelector(".card");
  const button = node.querySelector(".media");
  const body = node.querySelector(".card__body");
  const details = node.querySelector(".card__details");
  const video = node.querySelector("video");
  const cover = node.querySelector(".cover");
  video.src = item.clip;
  video.poster = item.poster;
  cover.src = item.poster;
  cover.alt = `${item.name} 动作预览`;
  video.dataset.start = item.start;
  video.dataset.end = item.end;
  node.querySelector(".number").textContent = `#${String(item.id).padStart(2, "0")}`;
  node.querySelector(".duration").textContent = `${item.duration.toFixed(1)}s`;
  node.querySelector("h2").textContent = item.name;
  node.querySelector(".tag").textContent = item.category === "hand" ? "手部元素" : "脚步元素";
  const companionCanvas = node.querySelector(".element-companion");
  if (companionCanvas) {
    companionCanvas.dataset.elementName = item.name;
    elementCompanionAnimations.push({ canvas: companionCanvas, name: item.name, sequence: null });
  }
  card.dataset.name = item.name.toLowerCase();
  card.dataset.elementName = item.name;
  card.dataset.category = item.category;
  body.setAttribute("role", "button");
  body.setAttribute("tabindex", "0");
  body.setAttribute("aria-expanded", "false");
  body.setAttribute("aria-label", `查看 ${item.name} 详情`);
  if (options.dailyIndex !== undefined) {
    const theme = (options.dailyIndex % 5) + 1;
    card.classList.add("daily-card", `daily-card--${theme}`);
    card.dataset.elementId = String(item.id);
    const crest = document.createElement("span");
    crest.className = "daily-card__crest";
    crest.innerHTML = `<b>✦</b><em>DAILY ${String(theme).padStart(2, "0")}</em>`;
    button.append(crest);
    const selector = document.createElement("button");
    selector.type = "button";
    selector.className = "daily-select";
    selector.dataset.dailyId = String(item.id);
    selector.setAttribute("aria-pressed", String(selectedDailyIds.has(item.id)));
    selector.innerHTML = `<span>${selectedDailyIds.has(item.id) ? "已选择" : "选入今天"}</span><i aria-hidden="true"></i>`;
    selector.addEventListener("click", event => {
      event.stopPropagation();
      toggleDailySelection(item.id);
    });
    card.append(selector);
  }
  const meta = document.createElement("div");
  meta.className = "card__meta";
  meta.textContent = `${item.category === "hand" ? "手部元素" : "脚步元素"} · ${item.duration.toFixed(1)} 秒`;
  details.append(meta);
  const variationShelf = document.createElement("section");
  variationShelf.className = "card__variations";
  variationShelf.hidden = true;
  details.append(variationShelf);
  if (publicNotes[item.name]) {
    const note = document.createElement("small");
    note.className = "card__source-note";
    note.textContent = publicNotes[item.name].text;
    const source = document.createElement("a");
    source.className = "card__source-link";
    source.href = publicNotes[item.name].url;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = `来源：${publicNotes[item.name].source} · 查看原文 ↗`;
    details.append(note, source);
  }

  const toggleDetails = () => {
    const expanded = card.classList.toggle("is-expanded");
    body.setAttribute("aria-expanded", String(expanded));
    details.setAttribute("aria-hidden", String(!expanded));
  };
  body.addEventListener("click", toggleDetails);
  body.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDetails();
    }
  });

  button.addEventListener("click", async () => {
    if (!video.paused) { stopVideo(video); return; }
    if (activeVideo && activeVideo !== video) stopVideo(activeVideo);
    activeVideo = video;
    video.currentTime = item.start;
    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
    card.classList.add("is-playing");
    try { await video.play(); } catch { card.classList.remove("is-playing"); }
  });

  video.addEventListener("ended", () => {
    card.classList.remove("is-playing");
    if (activeVideo === video) activeVideo = null;
  });
  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= item.start + item.duration) {
      video.pause();
      video.currentTime = item.start;
      card.classList.remove("is-playing");
      if (activeVideo === video) activeVideo = null;
    }
  });
  return node;
}

elements.forEach(item => grid.append(createCard(item)));

function startElementCompanions() {
  getPoseLibrary().then(library => {
    elementCompanionAnimations.forEach(animation => {
      animation.sequence = library.items.find(item => item.name === animation.name)?.sequence || null;
      animation.timeline = buildCompanionTimeline(
        animation.sequence,
        elements.find(item => item.name === animation.name)?.duration || interval
      );
      animation.visible = false;
      animation.lastEntry = null;
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const animation = elementCompanionAnimations.find(item => item.canvas === entry.target);
        if (animation) animation.visible = entry.isIntersecting;
      });
    }, { rootMargin: "180px 0px" });
    elementCompanionAnimations.forEach(animation => observer.observe(animation.canvas));
    cancelAnimationFrame(elementCompanionAnimationFrame);
    const startedAt = performance.now();
    const animate = now => {
      elementCompanionAnimations.forEach((animation, index) => {
        if (!animation.visible || !animation.timeline || !animation.canvas.isConnected) return;
        const entry = companionTimelineSample(animation.timeline, now - startedAt + index * 73);
        if (!entry) return;
        drawSoftCompanion(animation.canvas, entry.frame, {
          compact: true,
          previousFrame: entry.previousFrame,
          accentJoint: entry.accentJoint,
          keyPose: entry.keyPose
        });
      });
      elementCompanionAnimationFrame = requestAnimationFrame(animate);
    };
    elementCompanionAnimationFrame = requestAnimationFrame(animate);
  }).catch(() => {});
}

function dailySelection(items, count) {
  const dateKey = new Date().toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" });
  let seed = [...dateKey].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 2166136261);
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const target = seed % (index + 1);
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled.slice(0, count);
}

const todayDaily = dailySelection(elements, 5);
if (!todayDaily.some(item => publicNotes[item.name])) {
  const sourcedExample = elements.find(item => publicNotes[item.name]);
  if (sourcedExample) todayDaily[todayDaily.length - 1] = sourcedExample;
}
todayDaily.forEach((item, index) => dailyTrack.append(createCard(item, { dailyIndex: index })));
document.querySelector("#dailyPrev").addEventListener("click", () => dailyTrack.scrollBy({ left: -dailyTrack.clientWidth * .75, behavior: "smooth" }));
document.querySelector("#dailyNext").addEventListener("click", () => dailyTrack.scrollBy({ left: dailyTrack.clientWidth * .75, behavior: "smooth" }));

function toggleDailySelection(id) {
  if (selectedDailyIds.has(id)) {
    selectedDailyIds.delete(id);
    practiceMoveIds.delete(id);
  } else if (selectedDailyIds.size < 3) {
    selectedDailyIds.add(id);
    practiceMoveIds.add(id);
  } else {
    dailySelectionHint.textContent = "今天最多选 3 个。先取消一个，再换成更想练的动作。";
    dailySelectionHint.classList.add("is-warning");
    setTimeout(() => dailySelectionHint.classList.remove("is-warning"), 1200);
    return;
  }
  writeDailyPicks();
  updateDailySelection();
}

function updateDailySelection() {
  const selected = todayDaily.filter(item => selectedDailyIds.has(item.id));
  dailyTrack.querySelectorAll(".daily-card").forEach(card => {
    const id = Number(card.dataset.elementId);
    const isSelected = selectedDailyIds.has(id);
    card.classList.toggle("is-selected", isSelected);
    const selector = card.querySelector(".daily-select");
    if (selector) {
      selector.setAttribute("aria-pressed", String(isSelected));
      selector.querySelector("span").textContent = isSelected ? "已选择" : "选入今天";
    }
  });
  dailySelectionCount.textContent = `已选 ${selected.length} / 3`;
  dailySelectionHint.textContent = selected.length === 3
    ? "今天的 3 个推荐已带入下方记录，也可以继续从全部元素中添加。"
    : `还可以从推荐中选 ${3 - selected.length} 个；不选满也能直接记录。`;
  clearDailySelection.disabled = selected.length === 0;
  renderPracticeMoveEditors([...practiceMoveIds].map(id => elements.find(item => item.id === id)).filter(Boolean));
}

function capturePracticeMoveDrafts() {
  practiceMoveEditors.querySelectorAll(".practice-move-editor").forEach(editor => {
    const songs = [...editor.querySelectorAll(".practice-song-row")].map(row => ({
      title: row.querySelector(".practice-song-title").value,
      douyin: row.querySelector(".practice-song-douyin").checked
    }));
    practiceMoveDrafts.set(Number(editor.dataset.moveId), {
      variationType: editor.querySelector(".practice-variation-type").value,
      variationNote: editor.querySelector(".practice-variation-note").value,
      songs
    });
  });
}

function renderPracticeMoveEditors(selected) {
  capturePracticeMoveDrafts();
  practiceMoveEditors.replaceChildren();
  practiceMoveEmpty.hidden = selected.length > 0;
  selected.forEach((item, index) => {
    const draft = practiceMoveDrafts.get(item.id);
    const editor = document.createElement("article");
    editor.className = "practice-move-editor";
    editor.dataset.moveId = String(item.id);
    const songRows = Array.from({ length: 4 }, (_, songIndex) => `
      <div class="practice-song-row" data-song-index="${songIndex}">
        <span>${String(songIndex + 1).padStart(2, "0")}</span>
        <input class="practice-song-title" type="text" maxlength="100" placeholder="歌曲或版本名称" aria-label="${item.name} 第 ${songIndex + 1} 首歌" />
        <label class="douyin-toggle"><input class="practice-song-douyin" type="checkbox" /><i></i><em>抖音舞曲</em></label>
      </div>`).join("");
    editor.innerHTML = `
      <div class="practice-move-editor__head">
        <img src="${item.poster}" alt="${item.name} 动作封面" />
        <div><span>练习 ${String(index + 1).padStart(2, "0")}</span><h4>${item.name}</h4><small>${item.category === "hand" ? "手部元素" : "脚步元素"}</small></div>
        <button class="practice-move-remove" type="button" aria-label="移除 ${item.name}">×</button>
      </div>
      <div class="variation-fields">
        <label><span>变形方向</span><select class="practice-variation-type"><option value="节奏">节奏变化</option><option value="方向">方向变化</option><option value="幅度">幅度变化</option><option value="手脚组合">手脚组合</option><option value="个人感觉">个人感觉</option></select></label>
        <label><span>变形怎么做</span><input class="practice-variation-note" type="text" maxlength="160" placeholder="例如：交叉后多停半拍，再向左出去" /></label>
      </div>
      <div class="practice-songs"><div class="practice-songs__label"><span>练习歌曲</span><small>最多 4 首</small></div>${songRows}</div>`;
    if (draft) {
      editor.querySelector(".practice-variation-type").value = draft.variationType;
      editor.querySelector(".practice-variation-note").value = draft.variationNote;
      editor.querySelectorAll(".practice-song-row").forEach((row, songIndex) => {
        const song = draft.songs[songIndex];
        if (!song) return;
        row.querySelector(".practice-song-title").value = song.title;
        row.querySelector(".practice-song-douyin").checked = song.douyin;
      });
    }
    editor.querySelector(".practice-move-remove").addEventListener("click", () => {
      practiceMoveIds.delete(item.id);
      selectedDailyIds.delete(item.id);
      writeDailyPicks();
      updateDailySelection();
    });
    practiceMoveEditors.append(editor);
  });
}

clearDailySelection.addEventListener("click", () => {
  selectedDailyIds.forEach(id => practiceMoveIds.delete(id));
  selectedDailyIds.clear();
  writeDailyPicks();
  updateDailySelection();
});

practiceMoveSelect.innerHTML = elements.map(item => `<option value="${item.id}">${item.name} · ${item.category === "hand" ? "手部" : "脚步"}</option>`).join("");
addPracticeMove.addEventListener("click", () => {
  practiceMoveIds.add(Number(practiceMoveSelect.value));
  updateDailySelection();
});

function setRelativePracticeDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  practiceDate.value = date.toLocaleDateString("sv-SE", { timeZone: "Asia/Shanghai" });
}

function applyBasicSpokenPracticeNote(transcript, { updateStatus = true } = {}) {
  if (!transcript) {
    practiceVoiceStatus.textContent = "先说一句，或在框里输入练习内容。";
    return;
  }
  const normalized = transcript.toLocaleLowerCase();
  const matched = elements.filter(item => normalized.includes(item.name.toLocaleLowerCase()));
  matched.forEach(item => practiceMoveIds.add(item.id));

  if (transcript.includes("前天")) setRelativePracticeDate(2);
  else if (transcript.includes("昨天")) setRelativePracticeDate(1);
  else if (transcript.includes("今天")) practiceDate.value = dailyDateKey;

  const locationMatch = transcript.match(/在([^，。,.]{1,40}?)(?=练了|练习|跳舞|，|。|$)/);
  const partnerMatch = transcript.match(/和\s*([^，。,.]{1,24}?)(?=\s*在[^，。,.]{1,40}(?:练了|练习|跳舞)|(?:一起)?练|一起|，|。|$)/);
  const feelingMatches = transcript.match(/[^。！!]*(?:开心|满意|很爽|舒服)[^。！!]*[。！!]?/g) || [];
  const songMatches = [...transcript.matchAll(/《([^》]+)》/g)].map(match => match[1].trim());
  const styleMatch = transcript.match(/(?:主要练的(?:是|：)|主要练习(?:是|：))\s*([^。；，,\n]+)/i);
  const detailMatch = transcript.match(/注意细节[：:]\s*([^\n]+)/);
  const techniqueMatch = transcript.match(/动作要领[：:]\s*([^\n]+)/);
  const grooveMatch = transcript.match(/律动幅度[：:]\s*([^\n]+)/);
  const winsMatch = transcript.match(/(?:好的地方(?:在于)?|做得好的地方(?:是)?)[：：，,\s]*([\s\S]+)$/);
  const locationInput = document.querySelector("#practiceLocation");
  const partnersInput = document.querySelector("#practicePartners");
  const feelingInput = document.querySelector("#practiceFeeling");
  if (locationMatch && !locationInput.value) locationInput.value = locationMatch[1].trim();
  if (partnerMatch && !partnersInput.value) partnersInput.value = partnerMatch[1].trim();
  if (feelingMatches.length && !feelingInput.value) feelingInput.value = feelingMatches.map(value => value.trim()).join("\n");
  if (styleMatch && !document.querySelector("#practiceDanceStyle").value) document.querySelector("#practiceDanceStyle").value = styleMatch[1].trim();
  if (songMatches.length && !document.querySelector("#practiceMusic").value) document.querySelector("#practiceMusic").value = songMatches.join("、");
  if (winsMatch && !document.querySelector("#practiceWins").value) document.querySelector("#practiceWins").value = winsMatch[1].trim();
  if ((detailMatch || grooveMatch) && !document.querySelector("#practiceAttention").value) {
    document.querySelector("#practiceAttention").value = [detailMatch?.[1], grooveMatch?.[1]].filter(Boolean).map(value => value.trim()).join("\n");
  }
  if (techniqueMatch && !document.querySelector("#practiceTechnique").value) document.querySelector("#practiceTechnique").value = techniqueMatch[1].trim();
  if ((transcript.includes("抖音") || transcript.includes("抖舞")) && !document.querySelector("#practiceDouyinTitle").value) {
    document.querySelector("#practiceDouyinTitle").value = "抖音练舞视频";
  }
  updateDailySelection();
  if (updateStatus) practiceVoiceStatus.textContent = "已用本地基础整理。";
}

function setPracticeField(selector, value) {
  if (typeof value !== "string" || !value.trim()) return;
  document.querySelector(selector).value = value.trim();
}

function applyAiPracticeData(data) {
  if (!data || typeof data !== "object") return;
  if (/^\d{4}-\d{2}-\d{2}$/.test(data.date || "")) practiceDate.value = data.date;
  setPracticeField("#practiceLocation", data.location);
  setPracticeField("#practicePartners", Array.isArray(data.partners) ? data.partners.join("、") : data.partners);
  setPracticeField("#practiceDanceStyle", data.danceStyle);
  setPracticeField("#practiceMusic", Array.isArray(data.music) ? data.music.join("、") : data.music);
  setPracticeField("#practiceFeeling", data.feeling);
  setPracticeField("#practiceWins", data.wins);
  setPracticeField("#practiceAttention", data.attention);
  setPracticeField("#practiceTechnique", data.technique);
  setPracticeField("#practiceFeedback", data.feedback);
  setPracticeField("#practiceNextStep", data.nextStep);
  setPracticeField("#practiceDouyinTitle", data.douyinTitle);

  const knownMoveNames = Array.isArray(data.knownMoves) ? data.knownMoves : [];
  knownMoveNames.forEach(name => {
    const matched = elements.find(item => item.name.toLocaleLowerCase() === String(name).toLocaleLowerCase());
    if (matched) practiceMoveIds.add(matched.id);
  });
  const otherMoves = Array.isArray(data.otherMoves) ? data.otherMoves.filter(Boolean) : [];
  if (otherMoves.length) document.querySelector("#practiceOtherMoves").value = otherMoves.join("、");
  updateDailySelection();
}

async function applySpokenPracticeNote() {
  const transcript = practiceVoiceTranscript.value.trim();
  if (!transcript) {
    practiceVoiceStatus.textContent = "先说一句，或在框里输入练习内容。";
    return;
  }

  applyPracticeVoice.disabled = true;
  applyPracticeVoice.setAttribute("aria-busy", "true");
  practiceVoiceStatus.textContent = "正在用 AIsa · DeepSeek 整理完整记录…";
  try {
    const response = await fetch("/api/practice/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript,
        currentDate: dailyDateKey,
        elementNames: elements.map(item => item.name)
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "AISA_REQUEST_FAILED");
    applyAiPracticeData(payload.data);
    const totalTokens = Number(payload.usage?.total_tokens || payload.usage?.totalTokens || 0);
    const usageText = totalTokens ? ` · 本次 ${totalTokens} tokens` : "";
    practiceVoiceStatus.textContent = `AIsa · ${payload.model || "DeepSeek"} 已完成整理${usageText}`;
  } catch {
    applyBasicSpokenPracticeNote(transcript, { updateStatus: false });
    practiceVoiceStatus.textContent = "AIsa 暂时不可用，已自动改用本地基础整理。";
  } finally {
    applyPracticeVoice.disabled = false;
    applyPracticeVoice.removeAttribute("aria-busy");
  }
}

applyPracticeVoice.addEventListener("click", () => void applySpokenPracticeNote());

const SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
if (SpeechRecognition) {
  speechRecognition = new SpeechRecognition();
  speechRecognition.lang = "zh-CN";
  speechRecognition.interimResults = false;
  speechRecognition.continuous = false;
  speechRecognition.addEventListener("start", () => {
    practiceVoiceButton.classList.add("is-listening");
    practiceVoiceButton.innerHTML = '<span aria-hidden="true">●</span> 正在听…';
    practiceVoiceStatus.textContent = "说完后会自动整理；也可以随时停止。";
  });
  speechRecognition.addEventListener("result", event => {
    const text = [...event.results].map(result => result[0].transcript).join("");
    practiceVoiceTranscript.value = [practiceVoiceTranscript.value.trim(), text].filter(Boolean).join(" ");
    applySpokenPracticeNote();
  });
  speechRecognition.addEventListener("error", event => {
    practiceVoiceStatus.textContent = event.error === "not-allowed"
      ? "没有获得麦克风权限；仍可直接打字后点“整理到记录”。"
      : "这次没有听清，可以再试一次或直接打字。";
  });
  speechRecognition.addEventListener("end", () => {
    practiceVoiceButton.classList.remove("is-listening");
    practiceVoiceButton.innerHTML = '<span aria-hidden="true">●</span> 开始语音输入';
  });
  practiceVoiceButton.addEventListener("click", () => {
    if (practiceVoiceButton.classList.contains("is-listening")) speechRecognition.stop();
    else speechRecognition.start();
  });
} else {
  practiceVoiceButton.disabled = true;
  practiceVoiceButton.textContent = "当前浏览器不支持语音";
  practiceVoiceStatus.textContent = "可以直接打字，再点“整理到记录”。";
}

function clearDouyinVideoSelection({ markRemoved = false } = {}) {
  if (selectedDouyinPreviewUrl) URL.revokeObjectURL(selectedDouyinPreviewUrl);
  selectedDouyinPreviewUrl = "";
  selectedDouyinVideo = null;
  practiceDouyinVideo.value = "";
  practiceDouyinPreview.removeAttribute("src");
  practiceDouyinPreview.hidden = true;
  removePracticeDouyinVideo.hidden = true;
  practiceDouyinMeta.textContent = "还没有选择视频";
  practiceVideoExtraction.hidden = true;
  practiceVideoExtraction.textContent = "";
  if (markRemoved && editingPracticeSession) editingPracticeVideoChanged = true;
}

pickPracticeDouyinVideo.addEventListener("click", () => practiceDouyinVideo.click());
removePracticeDouyinVideo.addEventListener("click", () => clearDouyinVideoSelection({ markRemoved: true }));

async function extractPracticeVideoElements(file) {
  practiceVideoExtraction.hidden = false;
  practiceVideoExtraction.textContent = "正在从视频提取动作元素和舞种…";
  let prepared;
  try {
    const [pose, library] = await Promise.all([getPoseModule(), getPoseLibrary()]);
    prepared = await prepareVideo(file);
    const duration = Math.min(5.2, prepared.duration);
    const extracted = await pose.extractVideoPoseSequence(prepared.video, {
      start: Math.max(0, (prepared.duration - duration) / 2),
      duration,
      sampleCount: 18,
      seek: seekVideo
    });
    if (extracted.sequence.length < 8) throw new Error("pose-not-found");
    const comparison = pose.comparePoseQuery(extracted.sequence, library);
    const candidates = mapPoseMatches(comparison).slice(0, comparison.assessment.confident ? 3 : 2);
    candidates.forEach(({ item }) => practiceMoveIds.add(item.id));
    updateDailySelection();
    const danceStyleInput = document.querySelector("#practiceDanceStyle");
    if (!danceStyleInput.value.trim()) danceStyleInput.value = "Hip-Hop";
    practiceVideoExtraction.textContent = candidates.length
      ? `已提取元素候选：${candidates.map(({ item }) => item.name).join("、")}；舞种：Hip-Hop。请结合视频人工确认。`
      : "已识别为 Hip-Hop 练习视频，但没有找到稳定的库内元素候选。";
  } catch {
    practiceVideoExtraction.textContent = "已附上视频；暂时没有提取到稳定的人体动作。保存记录不受影响。";
  } finally {
    if (prepared?.source) URL.revokeObjectURL(prepared.source);
  }
}

function selectPracticeVideo(file, source = "upload") {
  if (!file) return false;
  if (!file.type.startsWith("video/")) {
    practiceDouyinMeta.textContent = "请选择视频文件。";
    practiceDouyinVideo.value = "";
    return false;
  }
  if (file.size > 300 * 1024 * 1024) {
    practiceDouyinMeta.textContent = "视频超过 300 MB，建议先压缩后再上传。";
    practiceDouyinVideo.value = "";
    return false;
  }
  clearDouyinVideoSelection();
  selectedDouyinVideo = file;
  if (editingPracticeSession) editingPracticeVideoChanged = true;
  selectedDouyinPreviewUrl = URL.createObjectURL(file);
  practiceDouyinPreview.src = selectedDouyinPreviewUrl;
  practiceDouyinPreview.hidden = false;
  removePracticeDouyinVideo.hidden = false;
  practiceDouyinMeta.textContent = `${source === "paste" ? "已粘贴" : "已选择"} · ${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  void extractPracticeVideoElements(file);
  return true;
}

practiceDouyinVideo.addEventListener("change", () => {
  selectPracticeVideo(practiceDouyinVideo.files?.[0]);
});

pastePracticeDouyinVideo.addEventListener("click", async () => {
  if (!navigator.clipboard?.read) {
    practiceDouyinMeta.textContent = "请先复制视频文件，再在此区域按 Ctrl+V 粘贴。";
    return;
  }
  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      const type = item.types.find(value => value.startsWith("video/"));
      if (!type) continue;
      const blob = await item.getType(type);
      const extension = type.split("/")[1]?.replace("quicktime", "mov") || "mp4";
      if (selectPracticeVideo(new File([blob], `粘贴视频-${Date.now()}.${extension}`, { type }), "paste")) return;
    }
    practiceDouyinMeta.textContent = "剪贴板里没有视频，请先复制一个视频文件。";
  } catch {
    practiceDouyinMeta.textContent = "无法读取剪贴板；请在这个页面按 Ctrl+V，或使用上传按钮。";
  }
});

document.addEventListener("paste", event => {
  const practiceSection = event.target.closest?.("#practiceForm");
  if (!practiceSection && !document.querySelector("#practiceRecords")?.matches(":target")) return;
  const files = [...(event.clipboardData?.files || [])];
  let file = files.find(item => item.type.startsWith("video/"));
  if (!file) {
    const item = [...(event.clipboardData?.items || [])].find(value => value.type.startsWith("video/"));
    file = item?.getAsFile();
  }
  if (!file) return;
  event.preventDefault();
  selectPracticeVideo(file, "paste");
});

practiceDate.value = dailyDateKey;
updateDailySelection();

const practiceDatabaseName = "hiphop-practice-database";
const practiceStoreName = "sessions";
let practiceDatabasePromise;

function openPracticeDatabase() {
  if (!practiceDatabasePromise) {
    practiceDatabasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(practiceDatabaseName, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(practiceStoreName)) {
          const store = database.createObjectStore(practiceStoreName, { keyPath: "id" });
          store.createIndex("practicedOn", "practicedOn");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return practiceDatabasePromise;
}

async function savePracticeSession(session) {
  const database = await openPracticeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(practiceStoreName, "readwrite");
    transaction.objectStore(practiceStoreName).put(session);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function readPracticeSessions() {
  const database = await openPracticeDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(practiceStoreName, "readonly").objectStore(practiceStoreName).getAll();
    request.onsuccess = () => resolve(request.result.sort((a, b) => String(b.createdAt || b.practicedOn).localeCompare(String(a.createdAt || a.practicedOn))));
    request.onerror = () => reject(request.error);
  });
}

function writeTarText(header, offset, length, value) {
  const bytes = new TextEncoder().encode(String(value));
  header.set(bytes.slice(0, length), offset);
}

function writeTarOctal(header, offset, length, value) {
  const octal = Math.max(0, Number(value) || 0).toString(8).padStart(length - 1, "0").slice(-(length - 1));
  writeTarText(header, offset, length, `${octal}\0`);
}

function createTarHeader(name, size, modifiedAt = Date.now()) {
  const header = new Uint8Array(512);
  writeTarText(header, 0, 100, name);
  writeTarText(header, 100, 8, "0000644\0");
  writeTarText(header, 108, 8, "0000000\0");
  writeTarText(header, 116, 8, "0000000\0");
  writeTarOctal(header, 124, 12, size);
  writeTarOctal(header, 136, 12, Math.floor(modifiedAt / 1000));
  header.fill(32, 148, 156);
  header[156] = "0".charCodeAt(0);
  writeTarText(header, 257, 6, "ustar\0");
  writeTarText(header, 263, 2, "00");
  writeTarText(header, 265, 32, "hiphop-practice");
  writeTarText(header, 297, 32, "hiphop-practice");
  const checksum = header.reduce((sum, byte) => sum + byte, 0).toString(8).padStart(6, "0").slice(-6);
  writeTarText(header, 148, 8, `${checksum}\0 `);
  return header;
}

function createTarPadding(size) {
  const remainder = size % 512;
  return remainder ? new Uint8Array(512 - remainder) : new Uint8Array(0);
}

function buildPracticeBackupArchive(sessions) {
  const videoEntries = [];
  const archivedSessions = sessions.map((session, index) => {
    const archivedSession = { ...session };
    const storedVideo = session.douyinVideo?.blob || session.douyinVideo;
    if (storedVideo instanceof Blob) {
      const originalName = session.douyinVideo?.name || `practice-video-${index + 1}.mp4`;
      const extensionMatch = originalName.match(/\.[a-z0-9]{1,8}$/i);
      const extension = extensionMatch ? extensionMatch[0].toLowerCase() : ".mp4";
      const archivePath = `videos/${String(index + 1).padStart(4, "0")}${extension}`;
      videoEntries.push({ path: archivePath, blob: storedVideo });
      archivedSession.douyinVideo = {
        name: originalName,
        type: session.douyinVideo?.type || storedVideo.type || "video/mp4",
        size: storedVideo.size,
        archivePath
      };
    } else {
      archivedSession.douyinVideo = null;
    }
    return archivedSession;
  });

  const localState = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith("hiphop-")) localState[key] = localStorage.getItem(key);
  }
  const manifest = {
    format: "hiphop-practice-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    sessionCount: archivedSessions.length,
    videoCount: videoEntries.length,
    sessions: archivedSessions,
    localState
  };
  const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
  const entries = [{ path: "manifest.json", blob: manifestBlob }, ...videoEntries];
  const parts = [];
  entries.forEach(entry => {
    parts.push(createTarHeader(entry.path, entry.blob.size), entry.blob, createTarPadding(entry.blob.size));
  });
  parts.push(new Uint8Array(1024));
  return {
    archive: new Blob(parts, { type: "application/x-tar" }),
    sessionCount: archivedSessions.length,
    videoCount: videoEntries.length
  };
}

async function backupAllPracticeRecords() {
  backupPracticeRecords.disabled = true;
  backupPracticeRecords.textContent = "正在备份…";
  practiceBackupStatus.textContent = "正在打包文字与原视频，请保持页面打开";
  try {
    const sessions = await readPracticeSessions();
    const backup = buildPracticeBackupArchive(sessions);
    const response = await fetch("/api/backups/practice", {
      method: "POST",
      headers: { "Content-Type": "application/x-tar" },
      body: backup.archive
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "BACKUP_FAILED");
    if (Number(payload.bytes) !== backup.archive.size) throw new Error("BACKUP_SIZE_MISMATCH");
    const summary = `${backup.sessionCount} 条记录 · ${backup.videoCount} 个视频`;
    practiceBackupStatus.textContent = `已完整备份并校验：${summary}`;
    localStorage.setItem("hiphop-last-practice-backup", JSON.stringify({
      createdAt: new Date().toISOString(),
      fileName: payload.fileName,
      bytes: payload.bytes,
      sessionCount: backup.sessionCount,
      videoCount: backup.videoCount
    }));
  } catch {
    practiceBackupStatus.textContent = "这次备份没有完成，本地原记录和视频没有改动";
  } finally {
    backupPracticeRecords.disabled = false;
    backupPracticeRecords.textContent = "再次备份";
  }
}

backupPracticeRecords.addEventListener("click", () => void backupAllPracticeRecords());

async function deletePracticeSession(id) {
  const database = await openPracticeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(practiceStoreName, "readwrite");
    transaction.objectStore(practiceStoreName).delete(id);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

function escapeRecordText(value = "") {
  return String(value).replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

function collectPracticeMoves() {
  return [...practiceMoveEditors.querySelectorAll(".practice-move-editor")].map(editor => {
    const item = elements.find(element => element.id === Number(editor.dataset.moveId));
    const songs = [...editor.querySelectorAll(".practice-song-row")].map(row => ({
      title: row.querySelector(".practice-song-title").value.trim(),
      douyin: row.querySelector(".practice-song-douyin").checked
    })).filter(song => song.title);
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      variationType: editor.querySelector(".practice-variation-type").value,
      variationNote: editor.querySelector(".practice-variation-note").value.trim(),
      songs
    };
  });
}

function setPracticeInputValue(selector, value = "") {
  const input = document.querySelector(selector);
  if (!input) return;
  const normalized = value || "";
  if (input instanceof HTMLSelectElement && normalized && ![...input.options].some(option => option.value === normalized)) {
    input.add(new Option(normalized, normalized));
  }
  input.value = normalized;
}

function resetPracticeForm({ keepDailySelection = true } = {}) {
  editingPracticeSession = null;
  editingPracticeVideoChanged = false;
  practiceForm.classList.remove("is-editing");
  practiceFormTitle.textContent = "新建一条练舞记录";
  practiceFormDescription.textContent = "可以补记以前的练习；每日选择会自动带入，但不必选满 3 个动作才能记录。";
  savePracticeRecord.textContent = "保存练舞记录";
  cancelPracticeEdit.hidden = true;
  practiceDate.value = dailyDateKey;
  practiceVoiceTranscript.value = "";
  [
    "#practiceOtherMoves", "#practiceLocation", "#practicePartners", "#practiceDanceStyle", "#practiceMusic",
    "#practiceFeeling", "#practiceWins", "#practiceAttention", "#practiceTechnique", "#practiceFeedback",
    "#practiceNextStep", "#practiceDouyinTitle"
  ].forEach(selector => setPracticeInputValue(selector));
  clearDouyinVideoSelection();
  practiceMoveEditors.replaceChildren();
  practiceMoveDrafts.clear();
  practiceMoveIds = keepDailySelection ? new Set(selectedDailyIds) : new Set();
  renderPracticeMoveEditors([...practiceMoveIds].map(id => elements.find(item => item.id === id)).filter(Boolean));
}

function editPracticeSession(session) {
  editingPracticeSession = session;
  editingPracticeVideoChanged = false;
  practiceForm.classList.add("is-editing");
  practiceFormTitle.textContent = "编辑练舞记录";
  practiceFormDescription.textContent = `正在修改 ${session.practicedOn || "这一天"} 的记录；保存后会覆盖原记录，并同步到私人云端。`;
  savePracticeRecord.textContent = "保存修改";
  cancelPracticeEdit.hidden = false;
  practiceDate.value = session.practicedOn || dailyDateKey;
  practiceVoiceTranscript.value = session.voiceNote || "";
  setPracticeInputValue("#practiceOtherMoves", session.otherMoves);
  setPracticeInputValue("#practiceLocation", session.location);
  setPracticeInputValue("#practicePartners", session.partners);
  setPracticeInputValue("#practiceDanceStyle", session.danceStyle);
  setPracticeInputValue("#practiceMusic", session.music);
  setPracticeInputValue("#practiceFeeling", session.feeling);
  setPracticeInputValue("#practiceWins", session.wins);
  setPracticeInputValue("#practiceAttention", session.attention);
  setPracticeInputValue("#practiceTechnique", session.technique);
  setPracticeInputValue("#practiceFeedback", session.feedback);
  setPracticeInputValue("#practiceNextStep", session.nextStep);
  setPracticeInputValue("#practiceDouyinTitle", session.douyinTitle);
  clearDouyinVideoSelection();
  const storedVideo = session.douyinVideo?.blob || session.douyinVideo;
  if (storedVideo instanceof Blob) {
    selectedDouyinVideo = storedVideo instanceof File
      ? storedVideo
      : new File([storedVideo], session.douyinVideo?.name || "练舞视频.mp4", { type: session.douyinVideo?.type || storedVideo.type || "video/mp4" });
    selectedDouyinPreviewUrl = URL.createObjectURL(selectedDouyinVideo);
    practiceDouyinPreview.src = selectedDouyinPreviewUrl;
    practiceDouyinPreview.hidden = false;
    removePracticeDouyinVideo.hidden = false;
    practiceDouyinMeta.textContent = `沿用原视频 · ${session.douyinVideo?.name || selectedDouyinVideo.name}`;
  } else if (session.cloudMedia?.object_path) {
    practiceDouyinMeta.textContent = `沿用私人云端视频 · ${session.cloudMedia.original_name || "练舞视频"}`;
    removePracticeDouyinVideo.hidden = false;
  }
  practiceMoveEditors.replaceChildren();
  practiceMoveDrafts.clear();
  const savedMoves = Array.isArray(session.moves) ? session.moves : [];
  savedMoves.forEach(move => practiceMoveDrafts.set(Number(move.id), {
    variationType: move.variationType || "节奏",
    variationNote: move.variationNote || "",
    songs: Array.from({ length: 4 }, (_, index) => move.songs?.[index] || { title: "", douyin: false })
  }));
  practiceMoveIds = new Set(savedMoves.map(move => Number(move.id)).filter(id => elements.some(item => item.id === id)));
  renderPracticeMoveEditors([...practiceMoveIds].map(id => elements.find(item => item.id === id)).filter(Boolean));
  practiceSaveStatus.textContent = "编辑模式：修改后点击“保存修改”。";
  practiceForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

cancelPracticeEdit.addEventListener("click", () => {
  resetPracticeForm();
  practiceSaveStatus.textContent = "已取消编辑，原记录没有变化。";
});

async function renderPracticeRecords() {
  try {
    const sessions = await readPracticeSessions();
    practiceRecordVideoUrls.forEach(url => URL.revokeObjectURL(url));
    practiceRecordVideoUrls = [];
    practiceRecordList.replaceChildren();
    practiceRecordCount.textContent = `${sessions.length} 次练习`;
    if (!sessions.length) {
      const empty = document.createElement("div");
      empty.className = "practice-record-empty";
      empty.innerHTML = "<strong>还没有练舞记录</strong><span>在上面补记一次练习，地点、同伴、视频和回馈都会一起保存。</span>";
      practiceRecordList.append(empty);
      return;
    }
    sessions.forEach(session => {
      const record = document.createElement("article");
      record.className = "practice-record";
      const sessionMoves = Array.isArray(session.moves) ? session.moves : [];
      const moveNames = sessionMoves.length
        ? sessionMoves.map(move => `<span>${escapeRecordText(move.name)}</span>`).join("")
        : `<span>${escapeRecordText(session.otherMoves || "自由练习")}</span>`;
      const context = [
        session.location && `地点：${escapeRecordText(session.location)}`,
        session.partners && `一起练：${escapeRecordText(session.partners)}`,
        session.danceStyle && `舞种：${escapeRecordText(session.danceStyle)}`,
        session.music && `歌曲：${escapeRecordText(session.music)}`
      ].filter(Boolean).join(" · ");
      const moveDetails = sessionMoves.map(move => {
        const moveSongs = Array.isArray(move.songs) ? move.songs : [];
        const songs = moveSongs.length
          ? moveSongs.map(song => `<li>${escapeRecordText(song.title)}${song.douyin ? "<em>抖音舞曲</em>" : ""}</li>`).join("")
          : "<li class=\"is-empty\">没有填写歌曲</li>";
        return `<div class="practice-record__move"><div><strong>${escapeRecordText(move.name)}</strong><span>${escapeRecordText(move.variationType)} · ${escapeRecordText(move.variationNote || "暂未记录变形")}</span></div><ol>${songs}</ol></div>`;
      }).join("");
      let douyinVideo = "";
      const storedVideo = session.douyinVideo?.blob || session.douyinVideo;
      if (storedVideo instanceof Blob) {
        const videoUrl = URL.createObjectURL(storedVideo);
        practiceRecordVideoUrls.push(videoUrl);
        douyinVideo = `<div class="practice-record__video"><strong>${escapeRecordText(session.douyinTitle || session.douyinVideo?.name || "抖音练舞视频")}</strong><video controls playsinline preload="metadata" src="${videoUrl}"></video></div>`;
      } else if (session.cloudMedia?.object_path) {
        douyinVideo = `<div class="practice-record__video"><strong>${escapeRecordText(session.douyinTitle || session.cloudMedia.original_name || "云端练舞视频")}</strong><button class="practice-cloud-video" type="button">从私人云端加载视频</button><span class="practice-cloud-video__status">视频保存在 Cloudflare R2，点击后通过登录令牌读取</span></div>`;
      }
      const noteBlocks = [
        session.feeling && `<div><span>练习感受</span><p>${escapeRecordText(session.feeling)}</p></div>`,
        session.wins && `<div><span>做得好的地方</span><p>${escapeRecordText(session.wins)}</p></div>`,
        session.attention && `<div><span>需要注意</span><p>${escapeRecordText(session.attention)}</p></div>`,
        session.technique && `<div><span>动作要领 / 新发现</span><p>${escapeRecordText(session.technique)}</p></div>`,
        session.feedback && `<div><span>收到的回馈</span><p>${escapeRecordText(session.feedback)}</p></div>`,
        session.nextStep && `<div><span>下次练习重点</span><p>${escapeRecordText(session.nextStep)}</p></div>`,
        session.voiceNote && `<div><span>口述原文</span><p>${escapeRecordText(session.voiceNote)}</p></div>`
      ].filter(Boolean).join("");
      record.innerHTML = `
        <div class="practice-record__summary">
          <time datetime="${escapeRecordText(session.practicedOn)}">${escapeRecordText(session.practicedOn)}</time>
          <div class="practice-record__moves">${moveNames}</div>
          <button class="practice-record__toggle" type="button" aria-expanded="false">查看记录</button>
        </div>
        <div class="practice-record__details" hidden>
          ${context ? `<p class="practice-record__context">${context}</p>` : ""}
          ${session.otherMoves ? `<p class="practice-record__other"><strong>其他练习</strong>${escapeRecordText(session.otherMoves)}</p>` : ""}
          <div class="practice-record__move-list">${moveDetails}</div>
          ${noteBlocks ? `<div class="practice-record__notes">${noteBlocks}</div>` : ""}
          ${douyinVideo}
          <div class="practice-record__actions"><button class="practice-record__edit" type="button">编辑这条记录</button><button class="practice-record__delete" type="button">删除这条记录</button></div>
        </div>`;
      const toggle = record.querySelector(".practice-record__toggle");
      const details = record.querySelector(".practice-record__details");
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        toggle.textContent = expanded ? "查看记录" : "收起记录";
        details.hidden = expanded;
      });
      if (editingPracticeSession?.id === session.id) record.classList.add("is-editing");
      record.querySelector(".practice-record__edit").addEventListener("click", () => editPracticeSession(session));
      record.querySelector(".practice-record__delete").addEventListener("click", async () => {
        await deletePracticeSession(session.id);
        if (globalThis.HipHopCloud) {
          try { await globalThis.HipHopCloud.deleteSession(session.id, session.cloudMedia); }
          catch { practiceSaveStatus.textContent = "本机记录已删除；云端删除会在下次同步时重试。"; }
        }
        renderPracticeRecords();
      });
      const cloudVideoButton = record.querySelector(".practice-cloud-video");
      if (cloudVideoButton) cloudVideoButton.addEventListener("click", async () => {
        const status = record.querySelector(".practice-cloud-video__status");
        cloudVideoButton.disabled = true;
        status.textContent = "正在安全读取视频…";
        try {
          const videoUrl = await globalThis.HipHopCloud.getVideoObjectUrl(session.cloudMedia);
          practiceRecordVideoUrls.push(videoUrl);
          const video = document.createElement("video");
          video.controls = true;
          video.playsInline = true;
          video.preload = "metadata";
          video.src = videoUrl;
          cloudVideoButton.replaceWith(video);
          status.textContent = "已从私人云端载入";
        } catch {
          status.textContent = "读取失败，请确认已经登录且云端连接正常。";
          cloudVideoButton.disabled = false;
        }
      });
      practiceRecordList.append(record);
    });
  } catch {
    practiceRecordList.innerHTML = '<div class="practice-record-empty"><strong>暂时无法打开本地数据库</strong><span>请确认浏览器允许网站保存本地数据。</span></div>';
  }
}

practiceForm.addEventListener("submit", async event => {
  event.preventDefault();
  const moves = collectPracticeMoves();
  const otherMoves = document.querySelector("#practiceOtherMoves").value.trim();
  const location = document.querySelector("#practiceLocation").value.trim();
  const partners = document.querySelector("#practicePartners").value.trim();
  const danceStyle = document.querySelector("#practiceDanceStyle").value.trim();
  const music = document.querySelector("#practiceMusic").value.trim();
  const feeling = document.querySelector("#practiceFeeling").value.trim();
  const wins = document.querySelector("#practiceWins").value.trim();
  const attention = document.querySelector("#practiceAttention").value.trim();
  const technique = document.querySelector("#practiceTechnique").value.trim();
  const feedback = document.querySelector("#practiceFeedback").value.trim();
  const nextStep = document.querySelector("#practiceNextStep").value.trim();
  const voiceNote = practiceVoiceTranscript.value.trim();
  const hasExistingVideo = Boolean(editingPracticeSession?.douyinVideo || editingPracticeSession?.cloudMedia);
  if (!moves.length && !otherMoves && !location && !partners && !danceStyle && !music && !feeling && !wins && !attention && !technique && !feedback && !nextStep && !selectedDouyinVideo && !hasExistingVideo) {
    practiceSaveStatus.textContent = "至少记下一项内容，再保存这条练习。";
    return;
  }
  const isEditing = Boolean(editingPracticeSession);
  const previousSession = editingPracticeSession;
  const originalStoredVideo = previousSession?.douyinVideo?.blob || previousSession?.douyinVideo;
  const shouldKeepOriginalVideo = isEditing && !editingPracticeVideoChanged;
  const nextVideo = shouldKeepOriginalVideo
    ? previousSession.douyinVideo || null
    : selectedDouyinVideo ? {
        name: selectedDouyinVideo.name,
        type: selectedDouyinVideo.type,
        size: selectedDouyinVideo.size,
        blob: selectedDouyinVideo
      } : null;
  const session = {
    ...previousSession,
    id: previousSession?.id || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    practicedOn: practiceDate.value || dailyDateKey,
    createdAt: previousSession?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location,
    partners,
    danceStyle,
    music,
    feeling,
    wins,
    attention,
    technique,
    feedback,
    nextStep,
    voiceNote,
    otherMoves,
    douyinTitle: document.querySelector("#practiceDouyinTitle").value.trim(),
    douyinVideo: nextVideo,
    moves
  };
  if (isEditing && editingPracticeVideoChanged) {
    session.mediaChanged = true;
    session.previousCloudMedia = previousSession?.cloudMedia || null;
    session.cloudMedia = null;
  } else if (isEditing && originalStoredVideo instanceof Blob && !session.douyinVideo) {
    session.douyinVideo = previousSession.douyinVideo;
  }
  const saveButton = savePracticeRecord;
  saveButton.disabled = true;
  practiceSaveStatus.textContent = "正在保存到这台设备…";
  try {
    await savePracticeSession(session);
    practiceSaveStatus.textContent = "已保存到本机，正在同步私人云端…";
    if (globalThis.HipHopCloud?.isSignedIn()) {
      try {
        const result = await globalThis.HipHopCloud.saveSession(session);
        practiceSaveStatus.textContent = result.videoStored
          ? "已保存：文字在 Supabase，视频在私人 Cloudflare R2。"
          : selectedDouyinVideo && !globalThis.HipHopCloud.hasVideoVault()
            ? "文字已同步到 Supabase；视频暂存本机，R2 部署后会自动上传。"
            : "已保存到本机并同步到 Supabase。";
      } catch {
        practiceSaveStatus.textContent = "已安全保存到本机；云端暂时失败，下次同步会重试。";
      }
    } else {
      practiceSaveStatus.textContent = "已保存到本机。登录私人云端后会自动同步。";
    }
    resetPracticeForm();
    await renderPracticeRecords();
    if (isEditing && !practiceSaveStatus.textContent.includes("失败") && !practiceSaveStatus.textContent.includes("重试")) {
      practiceSaveStatus.textContent = globalThis.HipHopCloud?.isSignedIn()
        ? "修改已保存，并已同步到私人云端。"
        : "修改已保存到本机；登录后会同步到私人云端。";
    }
    document.querySelector("#practiceRecords").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch {
    practiceSaveStatus.textContent = "保存失败，请检查浏览器的本地存储权限。";
  } finally {
    saveButton.disabled = false;
  }
});

renderPracticeRecords();
if (globalThis.HipHopCloud) {
  void globalThis.HipHopCloud.init({
    saveLocal: savePracticeSession,
    readLocal: readPracticeSessions,
    deleteLocal: deletePracticeSession,
    render: renderPracticeRecords
  });
}

const classDatabaseName = "hiphop-class-analysis-database";
const classStoreName = "class-analyses";
const classVariationStoreName = "class-variations";

function openClassDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(classDatabaseName, 2);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(classStoreName)) {
        request.result.createObjectStore(classStoreName, { keyPath: "id" });
      }
      if (!request.result.objectStoreNames.contains(classVariationStoreName)) {
        const store = request.result.createObjectStore(classVariationStoreName, { keyPath: "id" });
        store.createIndex("elementName", "elementName");
        store.createIndex("createdAt", "createdAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readClassAnalyses() {
  const database = await openClassDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(classStoreName, "readonly").objectStore(classStoreName).getAll();
    request.onsuccess = () => resolve((request.result || []).sort((a, b) =>
      String(b.classDate || b.createdAt).localeCompare(String(a.classDate || a.createdAt))
    ));
    request.onerror = () => reject(request.error);
  });
}

async function saveClassAnalysis(record) {
  const database = await openClassDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(classStoreName, "readwrite");
    transaction.objectStore(classStoreName).put(record);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function deleteClassAnalysis(id) {
  const database = await openClassDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(classStoreName, "readwrite");
    transaction.objectStore(classStoreName).delete(id);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function saveClassVariation(variation) {
  const database = await openClassDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(classVariationStoreName, "readwrite");
    transaction.objectStore(classVariationStoreName).put(variation);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function readClassVariations() {
  const database = await openClassDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(classVariationStoreName, "readonly").objectStore(classVariationStoreName).getAll();
    request.onsuccess = () => resolve((request.result || []).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
    request.onerror = () => reject(request.error);
  });
}

async function deleteClassVariation(id) {
  const database = await openClassDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(classVariationStoreName, "readwrite");
    transaction.objectStore(classVariationStoreName).delete(id);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function renderClassVariations() {
  classVariationVideoUrls.forEach(url => URL.revokeObjectURL(url));
  classVariationVideoUrls = [];
  try {
    const variations = await readClassVariations();
    const queued = variations.filter(item => item.destination === "queue");
    variationPracticeQueueCount.textContent = `${queued.length} 个片段`;
    variationPracticeQueueList.replaceChildren();
    if (!queued.length) {
      variationPracticeQueueList.innerHTML = "<p>课堂里 Mark 的变形会出现在这里。</p>";
    } else {
      queued.forEach(item => {
        const article = document.createElement("article");
        article.className = "variation-practice-card";
        article.innerHTML = `
          <video controls playsinline preload="metadata"></video>
          <div><span>${escapeRecordText(item.classDate || "课堂片段")}</span><strong>${escapeRecordText(item.elementName)} · ${escapeRecordText(item.note || "课堂变形")}</strong><small>${escapeRecordText(item.classTitle || "未命名课堂")}${item.teacher ? ` · ${escapeRecordText(item.teacher)}` : ""}</small></div>
          <button type="button">移除</button>`;
        const url = URL.createObjectURL(item.video);
        classVariationVideoUrls.push(url);
        article.querySelector("video").src = url;
        article.querySelector("button").addEventListener("click", async () => {
          await deleteClassVariation(item.id);
          await renderClassVariations();
        });
        variationPracticeQueueList.append(article);
      });
    }

    grid.querySelectorAll(".card__variations").forEach(shelf => {
      shelf.hidden = true;
      shelf.replaceChildren();
    });
    const library = variations.filter(item => item.destination === "library");
    const grouped = new Map();
    library.forEach(item => grouped.set(item.elementName, [...(grouped.get(item.elementName) || []), item]));
    grid.querySelectorAll(".card[data-element-name]").forEach(card => {
      const items = grouped.get(card.dataset.elementName) || [];
      if (!items.length) return;
      const shelf = card.querySelector(".card__variations");
      shelf.hidden = false;
      const heading = document.createElement("strong");
      heading.textContent = `我的课堂变形 · ${items.length}`;
      shelf.append(heading);
      items.forEach(item => {
        const row = document.createElement("div");
        row.className = "card__variation-row";
        row.innerHTML = `<video controls playsinline preload="metadata"></video><span>${escapeRecordText(item.note || "课堂片段")}<small>${escapeRecordText(item.classTitle || "未命名课堂")}</small></span><button type="button" aria-label="删除这个变形">×</button>`;
        const url = URL.createObjectURL(item.video);
        classVariationVideoUrls.push(url);
        row.querySelector("video").src = url;
        row.querySelector("button").addEventListener("click", async event => {
          event.stopPropagation();
          await deleteClassVariation(item.id);
          await renderClassVariations();
        });
        shelf.append(row);
      });
    });
  } catch {
    variationPracticeQueueCount.textContent = "暂时无法读取";
    variationPracticeQueueList.innerHTML = "<p>请确认浏览器允许网站保存本地视频。</p>";
  }
}

const classTeachersStorageKey = "hiphop-class-teachers-v1";

function readClassTeachers() {
  try {
    const saved = JSON.parse(localStorage.getItem(classTeachersStorageKey) || "[]");
    return Array.isArray(saved) ? saved.filter(name => typeof name === "string" && name.trim()).slice(0, 30) : [];
  } catch {
    return [];
  }
}

function renderClassTeachers(selected = "") {
  const teachers = readClassTeachers();
  classTeacher.innerHTML = '<option value="">请选择老师</option>' + teachers
    .map(name => `<option value="${escapeRecordText(name)}">${escapeRecordText(name)}</option>`).join("") +
    '<option value="__new__">＋ 添加新老师</option>';
  classTeacher.value = teachers.includes(selected) ? selected : selected ? "__new__" : "";
  classTeacherNewField.hidden = classTeacher.value !== "__new__";
  forgetClassTeacher.hidden = !classTeacher.value || classTeacher.value === "__new__";
  if (classTeacher.value === "__new__" && selected) classTeacherNew.value = selected;
}

function currentClassTeacher() {
  return classTeacher.value === "__new__" ? classTeacherNew.value.trim() : classTeacher.value.trim();
}

function rememberClassTeacher() {
  const name = currentClassTeacher();
  if (!name) return;
  const teachers = [name, ...readClassTeachers().filter(item => item !== name)].slice(0, 30);
  localStorage.setItem(classTeachersStorageKey, JSON.stringify(teachers));
  renderClassTeachers(name);
}

classTeacher.addEventListener("change", () => {
  classTeacherNewField.hidden = classTeacher.value !== "__new__";
  forgetClassTeacher.hidden = !classTeacher.value || classTeacher.value === "__new__";
  if (!classTeacherNewField.hidden) classTeacherNew.focus();
});
forgetClassTeacher.addEventListener("click", () => {
  const removed = classTeacher.value;
  if (!removed || removed === "__new__") return;
  localStorage.setItem(classTeachersStorageKey, JSON.stringify(readClassTeachers().filter(name => name !== removed)));
  renderClassTeachers();
});
classDate.addEventListener("click", () => {
  try { classDate.showPicker?.(); } catch { /* native calendar remains available */ }
});

function clearClassPersonPicker({ preserveTeacherCut = false } = {}) {
  selectedClassPerson = null;
  classDetectedPeople = [];
  lastClassVideoAnalysis = null;
  classPersonDetectionPending = false;
  classPersonChoices.replaceChildren();
  classPersonFrame.removeAttribute("src");
  classPersonPicker.hidden = true;
  retryClassPeople.hidden = true;
  classPeopleAcceptance = null;
  if (!preserveTeacherCut) {
    classTeacherDetection = null;
    selectedClassTeacherCandidate = null;
    classTeacherCandidates.replaceChildren();
    classTeacherCutPreview.pause();
    classTeacherCutPreview.removeAttribute("src");
    classTeacherCutPreview.style.removeProperty("--teacher-x");
    classTeacherCutPreview.style.removeProperty("--teacher-y");
    classTeacherCut.hidden = false;
    classTeacherCutStatus.textContent = "等待课堂视频或额外老师示范";
    regenerateTeacherCut.disabled = true;
  }
}

function clearTeacherDemoVideo() {
  if (selectedTeacherDemoPreviewUrl) URL.revokeObjectURL(selectedTeacherDemoPreviewUrl);
  selectedTeacherDemoPreviewUrl = "";
  selectedTeacherDemoVideo = null;
  teacherDemoVideoFile.value = "";
  teacherDemoVideoMeta.textContent = classTeacherPresence() === "yes"
    ? "未额外上传 · 优先从课堂视频寻找核心老师"
    : classTeacherPresence() === "no"
      ? "未额外上传 · 课堂视频不做老师识别"
      : "未额外上传 · 先确认课堂视频里是否有老师";
  removeTeacherDemoVideo.hidden = true;
}

function clearGeneratedTeacherCut() {
  if (generatedTeacherCutUrl) URL.revokeObjectURL(generatedTeacherCutUrl);
  generatedTeacherCutUrl = "";
  generatedTeacherCutBlob = null;
}

function renderClassPersonChoices() {
  classPersonChoices.replaceChildren();
  classDetectedPeople.forEach((person, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "class-person-choice";
    button.setAttribute("aria-label", `选择人物 ${index + 1} 作为我`);
    button.style.left = `${person.box.center.x * 100}%`;
    button.style.top = `${person.box.center.y * 100}%`;
    button.style.width = `${Math.max(10, person.box.width * 100)}%`;
    button.style.height = `${Math.max(18, person.box.height * 100)}%`;
    button.innerHTML = `<span>人物 ${index + 1}</span>`;
    button.addEventListener("click", () => {
      selectedClassPerson = { index, center: person.box.center };
      classPersonChoices.querySelectorAll("button").forEach(item => item.classList.toggle("is-selected", item === button));
      classPersonStatus.textContent = `已确认人物 ${index + 1} 是你；分析会沿着这个人的身体轨迹进行。`;
    });
    classPersonChoices.append(button);
  });
}

function selectedTeacherCropCenter(candidate) {
  return {
    x: (candidate.crop.x + candidate.crop.width / 2) * 100,
    y: (candidate.crop.y + candidate.crop.height / 2) * 100
  };
}

async function createTeacherCutBlob(file, candidate) {
  if (!file || !candidate || !globalThis.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) return null;
  const prepared = await prepareVideo(file);
  const video = prepared.video;
  const canvas = document.createElement("canvas");
  canvas.width = 540;
  canvas.height = 720;
  const context = canvas.getContext("2d", { alpha: false });
  const canvasStream = canvas.captureStream(30);
  const sourceStream = video.captureStream?.() || video.mozCaptureStream?.();
  sourceStream?.getAudioTracks?.().forEach(track => canvasStream.addTrack(track));
  const mimeTypes = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || "";
  const recorder = new MediaRecorder(canvasStream, mimeType ? { mimeType, videoBitsPerSecond: 3_200_000 } : undefined);
  const chunks = [];
  recorder.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
  const stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = () => reject(recorder.error || new Error("TEACHER_CUT_RECORD_FAILED"));
  });
  await seekVideo(video, candidate.segmentStart);
  video.muted = false;
  recorder.start(250);
  try { await video.play(); } catch { video.muted = true; await video.play(); }
  const crop = candidate.crop;
  const endTime = Math.min(video.duration, candidate.segmentStart + candidate.segmentDuration);
  await new Promise(resolve => {
    let stoppedDrawing = false;
    const draw = () => {
      if (stoppedDrawing) return;
      context.fillStyle = "#050505";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        video,
        Math.round(video.videoWidth * crop.x), Math.round(video.videoHeight * crop.y),
        Math.round(video.videoWidth * crop.width), Math.round(video.videoHeight * crop.height),
        0, 0, canvas.width, canvas.height
      );
      if (video.currentTime >= endTime || video.ended) {
        stoppedDrawing = true;
        video.pause();
        resolve();
        return;
      }
      requestAnimationFrame(draw);
    };
    draw();
  });
  recorder.stop();
  await stopped;
  canvasStream.getTracks().forEach(track => track.stop());
  if (prepared.source) URL.revokeObjectURL(prepared.source);
  return chunks.length ? new Blob(chunks, { type: recorder.mimeType || "video/webm" }) : null;
}

async function createClassVariationBlob(file, segment) {
  if (!file || !segment || !globalThis.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) return null;
  const prepared = await prepareVideo(file);
  const video = prepared.video;
  const scale = Math.min(1, 720 / Math.max(video.videoWidth, video.videoHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(2, Math.round(video.videoWidth * scale / 2) * 2);
  canvas.height = Math.max(2, Math.round(video.videoHeight * scale / 2) * 2);
  const context = canvas.getContext("2d", { alpha: false });
  const canvasStream = canvas.captureStream(30);
  const sourceStream = video.captureStream?.() || video.mozCaptureStream?.();
  sourceStream?.getAudioTracks?.().forEach(track => canvasStream.addTrack(track));
  const mimeTypes = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || "";
  const recorder = new MediaRecorder(canvasStream, mimeType ? { mimeType, videoBitsPerSecond: 2_400_000 } : undefined);
  const chunks = [];
  recorder.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
  const stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = () => reject(recorder.error || new Error("CLASS_VARIATION_RECORD_FAILED"));
  });
  await seekVideo(video, segment.start);
  video.muted = false;
  recorder.start(250);
  try { await video.play(); } catch { video.muted = true; await video.play(); }
  const endTime = Math.min(video.duration, segment.start + segment.duration);
  await new Promise(resolve => {
    const draw = () => {
      context.fillStyle = "#050505";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (video.currentTime >= endTime || video.ended) {
        video.pause();
        resolve();
        return;
      }
      requestAnimationFrame(draw);
    };
    draw();
  });
  recorder.stop();
  await stopped;
  canvasStream.getTracks().forEach(track => track.stop());
  sourceStream?.getVideoTracks?.().forEach(track => track.stop());
  if (prepared.source) URL.revokeObjectURL(prepared.source);
  return chunks.length ? new Blob(chunks, { type: recorder.mimeType || "video/webm" }) : null;
}

async function applyTeacherCandidate(candidate) {
  const sourceUrl = selectedTeacherDemoPreviewUrl || selectedClassPreviewUrl;
  const sourceFile = selectedTeacherDemoVideo || selectedClassVideo;
  if (!candidate || !sourceUrl) return;
  selectedClassTeacherCandidate = candidate;
  classTeacherCandidates.querySelectorAll("button").forEach(button =>
    button.classList.toggle("is-selected", Number(button.dataset.personIndex) === candidate.personIndex)
  );
  const center = selectedTeacherCropCenter(candidate);
  classTeacherCutPreview.pause();
  classTeacherCutPreview.src = sourceUrl;
  classTeacherCutPreview.style.setProperty("--teacher-x", `${center.x.toFixed(1)}%`);
  classTeacherCutPreview.style.setProperty("--teacher-y", `${center.y.toFixed(1)}%`);
  classTeacherCutPreview.currentTime = candidate.segmentStart;
  classTeacherCutPreview.dataset.segmentStart = String(candidate.segmentStart);
  classTeacherCutPreview.dataset.segmentEnd = String(candidate.segmentStart + candidate.segmentDuration);
  classTeacherCutMeta.textContent = `示范候选 ${candidate.segmentStart.toFixed(1)}–${(candidate.segmentStart + candidate.segmentDuration).toFixed(1)} 秒 · ${candidate.evidence}`;
  classTeacherCutStatus.textContent = classTeacherDetection?.needsConfirmation
    ? `自动判断人物 ${candidate.personIndex + 1} 可能是老师 · 需要确认`
    : `已自动选中人物 ${candidate.personIndex + 1} 作为老师候选`;
  regenerateTeacherCut.disabled = false;
  clearGeneratedTeacherCut();
  classTeacherCutStatus.textContent = "正在本地生成竖向老师直拍…";
  try {
    generatedTeacherCutBlob = await createTeacherCutBlob(sourceFile, candidate);
    if (generatedTeacherCutBlob) {
      generatedTeacherCutUrl = URL.createObjectURL(generatedTeacherCutBlob);
      classTeacherCutPreview.src = generatedTeacherCutUrl;
      classTeacherCutPreview.style.setProperty("--teacher-x", "50%");
      classTeacherCutPreview.style.setProperty("--teacher-y", "50%");
      classTeacherCutPreview.dataset.segmentStart = "0";
      classTeacherCutPreview.dataset.segmentEnd = String(candidate.segmentDuration);
      classTeacherCutMeta.textContent = `已生成独立竖向片段 · ${candidate.segmentDuration.toFixed(1)} 秒 · ${(generatedTeacherCutBlob.size / 1024 / 1024).toFixed(1)} MB`;
      classTeacherCutStatus.textContent = classTeacherDetection?.needsConfirmation
        ? `人物 ${candidate.personIndex + 1} 老师直拍已生成 · 老师身份需要确认`
        : `人物 ${candidate.personIndex + 1} 老师直拍已生成`;
    } else {
      classTeacherCutStatus.textContent = "当前浏览器不支持本地生成独立片段 · 需要确认；已保留聚焦播放。";
    }
  } catch {
    classTeacherCutStatus.textContent = "独立片段生成失败 · 需要确认；已保留聚焦播放。";
  }
}

function renderTeacherCandidates() {
  classTeacherCandidates.replaceChildren();
  (classTeacherDetection?.candidates || []).slice(0, 6).forEach((candidate, rank) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "class-teacher-candidate";
    button.dataset.personIndex = String(candidate.personIndex);
    button.innerHTML = `人物 ${candidate.personIndex + 1}${rank === 0 ? " · 系统推荐" : ""}<small>${Math.round(candidate.score * 100)}%</small>`;
    button.addEventListener("click", () => applyTeacherCandidate(candidate));
    classTeacherCandidates.append(button);
  });
}

async function prepareClassTeacherCut(prepared, pose) {
  classTeacherCut.hidden = false;
  classTeacherCutStatus.textContent = "正在判断画面中的核心老师…";
  classTeacherCutMeta.textContent = "按持续入镜、核心位置、人物体量与示范活跃度综合判断";
  classTeacherDetection = await pose.identifyTeacherCandidates(prepared.video, {
    seek: seekVideo,
    people: classDetectedPeople
  });
  if (!classTeacherDetection.selected) {
    classTeacherCutStatus.textContent = "没有形成可靠老师候选 · 需要确认";
    classTeacherCutMeta.textContent = "当前视频无法可靠定位核心老师，请选择人物更清晰、遮挡更少的片段。";
    return;
  }
  renderTeacherCandidates();
  await applyTeacherCandidate(classTeacherDetection.selected);
}

async function prepareTeacherFromSelectedClassVideo() {
  if (!selectedClassVideo || !classPeopleAcceptance?.passed || selectedTeacherDemoVideo || classTeacherPresence() !== "yes") return;
  let prepared;
  try {
    const pose = await getPoseModule();
    prepared = await prepareVideo(selectedClassVideo);
    await prepareClassTeacherCut(prepared, pose);
  } catch {
    classTeacherCutStatus.textContent = "老师直拍暂时没有生成 · 需要确认";
  } finally {
    if (prepared?.source) URL.revokeObjectURL(prepared.source);
  }
}

classTeacherPresenceInputs.forEach(input => input.addEventListener("change", () => {
  if (input.value === "yes") {
    classTeacherCutStatus.textContent = classPeopleAcceptance?.passed
      ? "已确认视频中有老师，正在从核心人物中截取"
      : "已确认视频中有老师；等待开场识别达到至少 4 人";
    classTeacherCutMeta.textContent = classPeopleAcceptance?.passed
      ? "按持续入镜、核心位置、人物体量与示范活跃度综合判断"
      : "开场通过 4 人门槛后，才会启动核心老师识别。";
    teacherDemoVideoMeta.textContent = "未额外上传 · 优先从课堂视频寻找核心老师";
    void prepareTeacherFromSelectedClassVideo();
    return;
  }
  if (!selectedTeacherDemoVideo) {
    clearGeneratedTeacherCut();
    classTeacherDetection = null;
    selectedClassTeacherCandidate = null;
    classTeacherCandidates.replaceChildren();
    classTeacherCutPreview.pause();
    classTeacherCutPreview.removeAttribute("src");
    regenerateTeacherCut.disabled = true;
    classTeacherCutStatus.textContent = "已确认课堂视频里没有老师";
    classTeacherCutMeta.textContent = "不会从课堂视频猜老师；如需示范，请使用下方独立上传入口。";
  }
  teacherDemoVideoMeta.textContent = selectedTeacherDemoVideo
    ? teacherDemoVideoMeta.textContent
    : "未额外上传 · 课堂视频不做老师识别";
}));

async function prepareTeacherDemoVideo(file) {
  let prepared;
  try {
    classTeacherCut.hidden = false;
    classTeacherCutStatus.textContent = "正在分析额外上传的老师示范…";
    teacherDemoVideoMeta.textContent = `已选择 · ${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
    const pose = await getPoseModule();
    prepared = await prepareVideo(file);
    const peopleResult = await pose.detectVideoPeople(prepared.video, { seek: seekVideo, time: 0 });
    const people = peopleResult.people.length ? peopleResult.people : [{ index: 0, box: { center: { x: .5, y: .5 }, height: .7 } }];
    classTeacherDetection = await pose.identifyTeacherCandidates(prepared.video, { seek: seekVideo, people });
    if (!classTeacherDetection.selected && peopleResult.people.length === 1) {
      classTeacherDetection = {
        needsConfirmation: false,
        candidates: [{ personIndex: 0, score: 1, crop: { x: .18, y: 0, width: .64, height: 1 }, segmentStart: 0, segmentDuration: Math.min(6, prepared.duration), evidence: "独立老师示范视频 · 单人主体" }]
      };
      classTeacherDetection.selected = classTeacherDetection.candidates[0];
    }
    if (!classTeacherDetection.selected) {
      classTeacherCutStatus.textContent = "额外示范视频没有形成稳定老师主体 · 需要确认";
      return;
    }
    renderTeacherCandidates();
    await applyTeacherCandidate(classTeacherDetection.selected);
  } catch {
    classTeacherCutStatus.textContent = "额外示范视频暂时无法分析 · 需要确认";
  } finally {
    if (prepared?.source) URL.revokeObjectURL(prepared.source);
  }
}

pickTeacherDemoVideo.addEventListener("click", () => teacherDemoVideoFile.click());
teacherDemoVideoFile.addEventListener("change", () => {
  const file = teacherDemoVideoFile.files?.[0];
  if (!file || !isClassVideoFile(file)) {
    teacherDemoVideoMeta.textContent = "请选择 MP4、MOV、M4V 或 WebM 老师示范视频。";
    return;
  }
  if (selectedTeacherDemoPreviewUrl) URL.revokeObjectURL(selectedTeacherDemoPreviewUrl);
  selectedTeacherDemoVideo = file;
  selectedTeacherDemoPreviewUrl = URL.createObjectURL(file);
  removeTeacherDemoVideo.hidden = false;
  void prepareTeacherDemoVideo(file);
});
removeTeacherDemoVideo.addEventListener("click", () => {
  clearTeacherDemoVideo();
  if (selectedClassVideo) void prepareClassPersonPicker(selectedClassVideo);
});

async function prepareClassPersonPicker(file) {
  clearClassPersonPicker({ preserveTeacherCut: Boolean(selectedTeacherDemoVideo) });
  classPersonDetectionPending = true;
  classPersonPicker.hidden = false;
  classPersonStatus.textContent = "正在截取人物画面…";
  let prepared;
  try {
    const pose = await getPoseModule();
    prepared = await prepareVideo(file);
    const result = await pose.detectVideoPeople(prepared.video, { seek: seekVideo, time: 0 });
    classPersonFrame.src = result.frameDataUrl;
    classDetectedPeople = result.people;
    classPeopleAcceptance = result.acceptance;
    retryClassPeople.hidden = result.acceptance.passed;
    if (!result.acceptance.passed) {
      selectedClassPerson = null;
      classPersonChoices.replaceChildren();
      classPersonStatus.textContent = `自动复检后识别到 ${result.acceptance.detectedPeople} 人，仍不足 4 人；请重新识别开场人物。`;
      if (!selectedTeacherDemoVideo) {
        classTeacherCutStatus.textContent = "等待开场人物识别达到至少 4 人；也可以直接额外上传老师示范";
        classTeacherCutMeta.textContent = "课堂视频人物识别异常时，不自动猜测老师身份。";
      }
      return;
    }
    renderClassPersonChoices();
    classPersonStatus.textContent = `开场识别到 ${classDetectedPeople.length} 人，已通过；请选择画面中的你。`;
    if (!selectedTeacherDemoVideo && classTeacherPresence() === "yes") {
      await prepareClassTeacherCut(prepared, pose);
    } else if (!selectedTeacherDemoVideo && classTeacherPresence() === "no") {
      classTeacherCutStatus.textContent = "已确认课堂视频里没有老师";
      classTeacherCutMeta.textContent = "不会从课堂视频猜老师；如需示范，请使用独立上传入口。";
    } else if (!selectedTeacherDemoVideo) {
      classTeacherCutStatus.textContent = "请确认这段课堂视频里是否有老师";
      classTeacherCutMeta.textContent = "选择“有老师”后，才会从核心人物中截取老师直拍。";
    }
  } catch (error) {
    console.warn("class_people_detection_failed", error instanceof Error ? error.message : String(error));
    classPersonStatus.textContent = "人物截图暂时没有生成；仍可使用文字总结，或更换一段人物完整入镜的视频。";
  } finally {
    classPersonDetectionPending = false;
    if (prepared?.source) URL.revokeObjectURL(prepared.source);
  }
}
retryClassPeople.addEventListener("click", () => {
  if (!selectedClassVideo || classPersonDetectionPending) return;
  void prepareClassPersonPicker(selectedClassVideo);
});

classTeacherCutPreview.addEventListener("timeupdate", () => {
  const end = Number(classTeacherCutPreview.dataset.segmentEnd || 0);
  if (end && classTeacherCutPreview.currentTime >= end) {
    classTeacherCutPreview.pause();
    classTeacherCutPreview.currentTime = Number(classTeacherCutPreview.dataset.segmentStart || 0);
  }
});
regenerateTeacherCut.addEventListener("click", () => applyTeacherCandidate(selectedClassTeacherCandidate));

function clearClassVideo() {
  if (selectedClassPreviewUrl) URL.revokeObjectURL(selectedClassPreviewUrl);
  selectedClassPreviewUrl = "";
  selectedClassVideo = null;
  classVideoFile.value = "";
  classVideoPreview.pause();
  classVideoPreview.removeAttribute("src");
  classVideoPreview.hidden = true;
  removeClassVideo.hidden = true;
  classVideoMeta.textContent = "还没有选择课堂视频";
  transcribeClassVideo.disabled = true;
  classTranscriptionStatus.textContent = "先选择课堂视频；需要登录私人账户";
  classTeacherPresenceInputs.forEach(input => { input.checked = false; });
  awaitingClassVideoPaste = false;
  classAnalysisForm.classList.remove("is-awaiting-video-paste");
  pasteClassVideo.classList.remove("is-ready", "is-dragging");
  clearClassPersonPicker({ preserveTeacherCut: Boolean(selectedTeacherDemoVideo) });
}

function isClassVideoFile(file) {
  return file instanceof File && (
    String(file.type || "").startsWith("video/") ||
    /\.(mp4|mov|m4v|webm)$/i.test(String(file.name || ""))
  );
}

function selectClassVideo(file, source = "upload") {
  if (!file) return false;
  if (!isClassVideoFile(file)) {
    classVideoMeta.textContent = "没有识别成视频文件。请选择 MP4、MOV、M4V 或 WebM。";
    return false;
  }
  if (file.size > 500 * 1024 * 1024) {
    classVideoMeta.textContent = "第一版单个课堂视频上限为 500 MB，请先压缩后再上传。";
    return false;
  }
  clearClassVideo();
  selectedClassVideo = file;
  selectedClassPreviewUrl = URL.createObjectURL(file);
  classVideoPreview.src = selectedClassPreviewUrl;
  classVideoPreview.hidden = false;
  removeClassVideo.hidden = false;
  classVideoMeta.textContent = `${source === "paste" ? "已粘贴" : "已选择"} · ${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  transcribeClassVideo.disabled = false;
  classTranscriptionStatus.textContent = "可选：点击后才会调用语音转写";
  awaitingClassVideoPaste = false;
  classAnalysisForm.classList.remove("is-awaiting-video-paste");
  pasteClassVideo.classList.remove("is-ready", "is-dragging");
  classAnalysisResult.hidden = true;
  void prepareClassPersonPicker(file);
  return true;
}

async function extractClassAudio(file) {
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AudioContextClass || !globalThis.MediaRecorder) return { blob: file, audioOnly: false };
  const mimeTypes = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"];
  const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));
  if (!mimeType) return { blob: file, audioOnly: false };

  const sourceUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = sourceUrl;
  video.preload = "auto";
  video.playsInline = true;
  const audioContext = new AudioContextClass();
  try {
    await new Promise((resolve, reject) => {
      video.addEventListener("loadedmetadata", resolve, { once: true });
      video.addEventListener("error", reject, { once: true });
      video.load();
    });
    await audioContext.resume();
    const source = audioContext.createMediaElementSource(video);
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);
    const recorder = new MediaRecorder(destination.stream, { mimeType, audioBitsPerSecond: 96_000 });
    const chunks = [];
    recorder.addEventListener("dataavailable", event => { if (event.data?.size) chunks.push(event.data); });
    const stopped = new Promise((resolve, reject) => {
      recorder.addEventListener("stop", resolve, { once: true });
      recorder.addEventListener("error", () => reject(recorder.error || new Error("AUDIO_EXTRACTION_FAILED")), { once: true });
    });
    recorder.start(500);
    await video.play();
    await new Promise((resolve, reject) => {
      video.addEventListener("ended", resolve, { once: true });
      video.addEventListener("error", reject, { once: true });
    });
    recorder.stop();
    await stopped;
    const blob = new Blob(chunks, { type: mimeType.split(";", 1)[0] });
    return blob.size ? { blob, audioOnly: true } : { blob: file, audioOnly: false };
  } finally {
    video.pause();
    URL.revokeObjectURL(sourceUrl);
    await audioContext.close().catch(() => {});
  }
}

transcribeClassVideo.addEventListener("click", async () => {
  if (!selectedClassVideo) return;
  if (!globalThis.HipHopCloud?.isSignedIn()) {
    classTranscriptionStatus.textContent = "请先登录私人账户，再调用视频口述转写。";
    return;
  }
  transcribeClassVideo.disabled = true;
  transcribeClassVideo.textContent = "正在提取口述…";
  classTranscriptionStatus.textContent = "正在本地提取音轨，耗时可能接近视频时长。";
  try {
    const media = await extractClassAudio(selectedClassVideo);
    classTranscriptionStatus.textContent = media.audioOnly
      ? "音轨已提取，正在识别老师口述…"
      : "当前浏览器无法单独提取音轨，正在从原视频识别口述…";
    const result = await globalThis.HipHopCloud.transcribeClassVideo(media.blob);
    const text = String(result?.text || "").trim();
    if (!text) throw new Error("NO_SPEECH_DETECTED");
    const existing = classTranscript.value.trim();
    classTranscript.value = existing ? `${existing}\n\n【视频自动转写】\n${text}` : text;
    classTranscriptionStatus.textContent = `已提取视频口述 · ${result.model || "Whisper"}；请复核后生成课堂分析。`;
  } catch (error) {
    const message = String(error?.message || "");
    classTranscriptionStatus.textContent = message.includes("TOO_LARGE")
      ? "这段视频过大，请先截取课堂口述片段再转写。"
      : message.includes("NO_SPEECH")
        ? "没有识别到稳定口述 · 需要确认；可手动粘贴课堂笔记。"
        : "这次没有完成转写 · 需要确认；视频动作分析仍可继续。";
  } finally {
    transcribeClassVideo.disabled = false;
    transcribeClassVideo.textContent = "从课堂视频提取口述";
  }
});

async function readClassVideoFromClipboard() {
  if (!navigator.clipboard?.read) {
    classVideoMeta.textContent = "已准备好：请现在按 Ctrl+V。iPhone 请使用“从照片 / 文件选择”。";
    return false;
  }
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const item of clipboardItems) {
      const videoType = item.types.find(type => type.startsWith("video/"));
      if (!videoType) continue;
      const blob = await item.getType(videoType);
      selectClassVideo(new File([blob], `课堂视频-${Date.now()}.mp4`, { type: videoType }), "paste");
      return true;
    }
    classVideoMeta.textContent = "剪贴板里没有视频文件。请在文件管理器中复制视频文件，再回到这里按 Ctrl+V。";
  } catch {
    classVideoMeta.textContent = "浏览器不允许按钮直接读取剪贴板。请现在按 Ctrl+V；iPhone 请从照片选择。";
  }
  return false;
}

pickClassVideo.addEventListener("click", () => classVideoFile.click());
pasteClassVideo.addEventListener("click", async () => {
  awaitingClassVideoPaste = true;
  classAnalysisForm.classList.add("is-awaiting-video-paste");
  pasteClassVideo.classList.add("is-ready");
  pasteClassVideo.focus({ preventScroll: true });
  classVideoMeta.textContent = "粘贴框已激活：请现在按 Ctrl+V。";
  await readClassVideoFromClipboard();
});
pasteClassVideo.addEventListener("keydown", event => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  pasteClassVideo.click();
});
["dragenter", "dragover"].forEach(type => pasteClassVideo.addEventListener(type, event => {
  event.preventDefault();
  awaitingClassVideoPaste = true;
  pasteClassVideo.classList.add("is-ready", "is-dragging");
  classVideoMeta.textContent = "松开鼠标即可放入课堂视频。";
}));
["dragleave", "dragend"].forEach(type => pasteClassVideo.addEventListener(type, () => {
  pasteClassVideo.classList.remove("is-dragging");
}));
pasteClassVideo.addEventListener("drop", event => {
  event.preventDefault();
  const file = [...(event.dataTransfer?.files || [])].find(isClassVideoFile);
  if (file) selectClassVideo(file, "drop");
  else classVideoMeta.textContent = "拖入的内容里没有 MP4、MOV、M4V 或 WebM 视频。";
});
removeClassVideo.addEventListener("click", clearClassVideo);
classVideoFile.addEventListener("change", () => selectClassVideo(classVideoFile.files?.[0]));
document.addEventListener("paste", event => {
  if (event.defaultPrevented) return;
  const isClassTarget = awaitingClassVideoPaste || event.target.closest?.("#classAnalysis") || location.hash === "#classAnalysis";
  if (!isClassTarget) return;
  const directFiles = [...(event.clipboardData?.files || [])];
  const itemFiles = [...(event.clipboardData?.items || [])]
    .filter(item => item.kind === "file")
    .map(item => item.getAsFile())
    .filter(Boolean);
  const file = [...directFiles, ...itemFiles].find(isClassVideoFile);
  if (!file) {
    if (awaitingClassVideoPaste) {
      event.preventDefault();
      classVideoMeta.textContent = "浏览器没有把剪贴板中的文件交给网页。请点击下方“选择 MP4 / 从照片选择”，这是同一个上传入口。";
    }
    return;
  }
  event.preventDefault();
  selectClassVideo(file, "paste");
});

function splitClassLines(text) {
  return String(text || "").split(/\r?\n|[。！？；，,]/).map(line => line.trim()).filter(Boolean);
}

function localClassTextAnalysis(transcript) {
  const lines = splitClassLines(transcript);
  const uncertain = lines.filter(line => /好像|可能|大概|不确定|听不清|叫什么|应该是|也许/.test(line)).slice(0, 10);
  const certainText = lines.filter(line => !uncertain.includes(line)).join("。");
  const knownMoves = names.filter(name => certainText.toLowerCase().includes(name.toLowerCase()));
  const problemPattern = /问题|抢拍|慢拍|重心太高|不够|放炮|跟不上|忘|做错|没做到|卡住/;
  const certainLines = lines.filter(line => !uncertain.includes(line));
  const problems = certainLines.filter(line => problemPattern.test(line)).slice(0, 10);
  const practicePoints = lines.filter(line =>
    !uncertain.includes(line) && /要|注意|发力|保持|不要|记得|从.+开始|带动|控制|重心转换/.test(line)
  ).slice(0, 12);
  const exercises = lines.filter(line =>
    !uncertain.includes(line) && /练了|练习|训练|组合|反复|慢速|原速|跟音乐|分解/.test(line)
  ).slice(0, 12);
  return {
    knownMoves,
    otherMoves: [],
    practicePoints,
    problems,
    exercises,
    summary: lines.length ? lines.slice(0, 4).join("；") + "。" : "",
    needsConfirmation: uncertain
  };
}

async function parseClassTranscript(transcript) {
  if (!transcript.trim()) return { data: localClassTextAnalysis(""), model: "仅视频动作匹配" };
  try {
    const response = await fetch("/api/class/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript,
        classTitle: classTitle.value,
        teacher: currentClassTeacher(),
        elementNames: names
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "CLASS_PARSE_FAILED");
    return payload;
  } catch {
    return { data: localClassTextAnalysis(transcript), model: "本地保底整理（AI 服务暂不可用）" };
  }
}

function uncertainMoveNames(data) {
  const confirmationText = (data.needsConfirmation || []).join(" ").toLowerCase();
  return [...(data.knownMoves || []), ...(data.otherMoves || [])].filter(name =>
    confirmationText.includes(String(name).toLowerCase())
  );
}

function trajectoryFindings(metrics) {
  if (!metrics || metrics.coverage < .45) {
    return ["需要确认：视频中你的完整身体轨迹覆盖不足，当前无法形成可靠的技术判断；建议使用全身持续入镜、遮挡更少的片段。"];
  }
  const findings = [];
  if (metrics.armRangeBalance < .68) {
    findings.push(`左右手臂动作幅度存在较明显差异（平衡系数 ${metrics.armRangeBalance.toFixed(2)}）；是否属于动作设计，需要确认老师示范后再判断。`);
  }
  if (metrics.legRangeBalance < .68) {
    findings.push(`左右腿活动幅度不对称（平衡系数 ${metrics.legRangeBalance.toFixed(2)}）；需要确认动作设计与老师示范，再核对重心转换和支撑腿稳定性。`);
  }
  if (metrics.pauseRatio > .28) {
    findings.push(`连续轨迹中检测到较多低速停顿（约 ${Math.round(metrics.pauseRatio * 100)}% 的采样间隔）；停顿是 Groove 处理还是衔接中断，需要确认音乐拍点。`);
  }
  if (metrics.speedVariation > 1.15) {
    findings.push(`身体中心移动速度波动较大（波动系数 ${metrics.speedVariation.toFixed(2)}）；这是节奏层次线索，是否符合编排的收放关系，需要确认音乐和老师示范。`);
  }
  if (!findings.length) {
    findings.push(`本段视频的人体轨迹覆盖达到 ${Math.round(metrics.coverage * 100)}%，左右幅度与连续性未出现明显异常；Groove、律动质感与拍点关系需要确认音乐和老师示范。`);
  }
  return findings;
}

async function analyzeClassVideo(file) {
  if (!file) return { candidates: [], findings: ["需要确认：未上传课堂视频，无法从个人运动轨迹提取练习与问题。"], metrics: null, scanSegments: [], duration: 0 };
  let prepared;
  try {
    const [pose, library] = await Promise.all([getPoseModule(), getPoseLibrary()]);
    prepared = await prepareVideo(file);
    const clipDuration = Math.min(4.9, prepared.duration);
    const maximumStart = Math.max(0, prepared.duration - clipDuration - .05);
    const starts = prepared.duration <= 6
      ? [0]
      : [.08, .34, .60, .84].map(ratio => Math.min(maximumStart, prepared.duration * ratio));
    const totals = new Map();
    const scanSegments = [];
    for (const start of [...new Set(starts.map(value => value.toFixed(2)))].map(Number)) {
      const extracted = await pose.extractVideoPersonTrajectory(prepared.video, {
        start,
        duration: clipDuration,
        sampleCount: 14,
        seek: seekVideo,
        referenceCenter: selectedClassPerson?.center || { x: .5, y: .5 }
      });
      if (extracted.sequence.length < 7) continue;
      const comparison = pose.comparePoseQuery(extracted.sequence, library);
      const segmentMatches = mapPoseMatches(comparison).slice(0, comparison.assessment.confident ? 2 : 1);
      scanSegments.push({
        start,
        duration: Math.min(clipDuration, prepared.duration - start),
        movement: extracted.metrics?.speedVariation || 0,
        matches: segmentMatches.map(match => ({ name: match.item.name, score: match.score, distance: match.distance }))
      });
      segmentMatches.forEach((match, rank) => {
        if (!comparison.assessment.confident && match.distance > .135) return;
        if (comparison.assessment.confident && match.distance > .16) return;
        const current = totals.get(match.item.name) || { score: 0, hits: 0, bestDistance: Infinity, segments: [] };
        current.score += match.score * (rank === 0 ? 1 : .65);
        current.hits += 1;
        current.bestDistance = Math.min(current.bestDistance, match.distance);
        current.segments.push({ start, duration: Math.min(clipDuration, prepared.duration - start), score: match.score, distance: match.distance });
        totals.set(match.item.name, current);
      });
    }
    const candidates = [...totals.entries()]
      .sort((a, b) => (b[1].hits * 2 + b[1].score) - (a[1].hits * 2 + a[1].score))
      .filter(([, evidence]) => evidence.hits >= 2 || evidence.bestDistance < .08)
      .slice(0, 3)
      .map(([name, evidence]) => ({
        name,
        ...evidence,
        bestSegment: [...evidence.segments].sort((a, b) => b.score - a.score || a.distance - b.distance)[0]
      }));
    const trajectory = await pose.extractVideoPersonTrajectory(prepared.video, {
      start: 0,
      duration: Math.min(prepared.duration, 45),
      sampleCount: Math.min(42, Math.max(24, Math.round(prepared.duration * 1.2))),
      seek: seekVideo,
      referenceCenter: selectedClassPerson?.center || { x: .5, y: .5 }
    });
    return { candidates, findings: trajectoryFindings(trajectory.metrics), metrics: trajectory.metrics, scanSegments, duration: prepared.duration };
  } catch {
    return { candidates: [], findings: ["需要确认：这次没有获得稳定的个人运动轨迹；请确认已经点选画面中的自己，并尽量使用全身完整入镜的视频。"], metrics: null, scanSegments: [], duration: 0 };
  } finally {
    if (prepared?.source) URL.revokeObjectURL(prepared.source);
  }
}

function drawMoveSkeleton(canvas, frame) {
  drawSoftCompanion(canvas, frame);
}

function companionPoints(canvas, frame, padding = 16) {
  if (!Array.isArray(frame) || frame.length < 64) return null;
  const points = Array.from({ length: 16 }, (_, index) => ({
    x: frame[index * 4], y: frame[index * 4 + 1], visibility: frame[index * 4 + 3]
  }));
  const visible = points.filter(point => point.visibility > .3);
  if (!visible.length) return null;
  const minX = Math.min(...visible.map(point => point.x));
  const maxX = Math.max(...visible.map(point => point.x));
  const minY = Math.min(...visible.map(point => point.y));
  const maxY = Math.max(...visible.map(point => point.y));
  const bodyHeight = Math.max(.1, maxY - minY);
  const visualMinY = minY - bodyHeight * .32;
  const scale = Math.min(
    (canvas.width - padding * 2) / Math.max(.1, maxX - minX),
    (canvas.height - padding * 2) / Math.max(.1, maxY - visualMinY)
  );
  return {
    points,
    project: point => ({
      x: canvas.width / 2 + (point.x - (minX + maxX) / 2) * scale,
      y: canvas.height / 2 + (point.y - (visualMinY + maxY) / 2) * scale
    })
  };
}

function companionBlobSegment(context, start, end, startRadius, endRadius, fillStyle) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy) || 1;
  const normal = { x: -dy / length, y: dx / length };
  const direction = { x: dx / length, y: dy / length };
  context.fillStyle = fillStyle;
  context.beginPath();
  context.moveTo(start.x + normal.x * startRadius, start.y + normal.y * startRadius);
  context.lineTo(end.x + normal.x * endRadius, end.y + normal.y * endRadius);
  context.quadraticCurveTo(
    end.x + direction.x * endRadius,
    end.y + direction.y * endRadius,
    end.x - normal.x * endRadius,
    end.y - normal.y * endRadius
  );
  context.lineTo(start.x - normal.x * startRadius, start.y - normal.y * startRadius);
  context.quadraticCurveTo(
    start.x - direction.x * startRadius,
    start.y - direction.y * startRadius,
    start.x + normal.x * startRadius,
    start.y + normal.y * startRadius
  );
  context.closePath();
  context.fill();
}

function companionEllipse(context, center, radiusX, radiusY, rotation, fillStyle) {
  context.fillStyle = fillStyle;
  context.beginPath();
  context.ellipse(center.x, center.y, radiusX, radiusY, rotation, 0, Math.PI * 2);
  context.fill();
}

function drawSoftCompanion(canvas, frame, {
  compact = false,
  previousFrame = null,
  accentJoint = 15,
  keyPose = false
} = {}) {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  const geometry = companionPoints(canvas, frame, compact ? 24 : 21);
  if (!geometry) return;
  const { points, project } = geometry;
  const bodyGradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  bodyGradient.addColorStop(0, "#ffffff");
  bodyGradient.addColorStop(.55, "#efede8");
  bodyGradient.addColorStop(1, "#aaa69e");
  const leftShoulder = project(points[0]);
  const rightShoulder = project(points[1]);
  const leftHip = project(points[6]);
  const rightHip = project(points[7]);
  const shoulderMid = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };
  const hipMid = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 };
  const torsoLength = Math.max(16, Math.hypot(shoulderMid.x - hipMid.x, shoulderMid.y - hipMid.y));
  const torsoDirection = {
    x: (hipMid.x - shoulderMid.x) / torsoLength,
    y: (hipMid.y - shoulderMid.y) / torsoLength
  };
  const torsoRotation = Math.atan2(hipMid.y - shoulderMid.y, hipMid.x - shoulderMid.x) - Math.PI / 2;
  const shoulderWidth = Math.max(torsoLength * .58, Math.hypot(rightShoulder.x - leftShoulder.x, rightShoulder.y - leftShoulder.y));
  const hipWidth = Math.max(torsoLength * .45, Math.hypot(rightHip.x - leftHip.x, rightHip.y - leftHip.y));
  const headRadius = torsoLength * .245;
  const head = {
    x: shoulderMid.x - torsoDirection.x * torsoLength * .43,
    y: shoulderMid.y - torsoDirection.y * torsoLength * .43
  };

  if (previousFrame) {
    const previousGeometry = companionPoints(canvas, previousFrame, compact ? 24 : 21);
    const previousPoint = previousGeometry?.points?.[accentJoint];
    const currentPoint = points[accentJoint];
    if (previousPoint?.visibility > .3 && currentPoint?.visibility > .3) {
      const from = previousGeometry.project(previousPoint);
      const to = project(currentPoint);
      const distance = Math.hypot(to.x - from.x, to.y - from.y);
      if (distance > 3) {
        context.strokeStyle = "rgba(242,193,78,.42)";
        context.lineWidth = compact ? 2.2 : 3.2;
        context.lineCap = "round";
        context.setLineDash([2, 7]);
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.quadraticCurveTo((from.x + to.x) / 2, Math.min(from.y, to.y) - distance * .18, to.x, to.y);
        context.stroke();
        context.setLineDash([]);
      }
    }
  }

  context.shadowColor = "rgba(0,0,0,.42)";
  context.shadowBlur = compact ? 5 : 9;
  context.shadowOffsetY = compact ? 3 : 5;

  const drawLimb = (indexes, radii) => {
    for (let index = 0; index < indexes.length - 1; index++) {
      const first = indexes[index];
      const second = indexes[index + 1];
      if (points[first].visibility < .3 || points[second].visibility < .3) continue;
      companionBlobSegment(context, project(points[first]), project(points[second]), radii[index], radii[index + 1], bodyGradient);
    }
  };

  const armRadii = [torsoLength * .14, torsoLength * .12, torsoLength * .085];
  const legRadii = [torsoLength * .19, torsoLength * .155, torsoLength * .105];
  drawLimb([6,8,10], legRadii);
  drawLimb([7,9,11], legRadii);

  const chestCenter = {
    x: shoulderMid.x + torsoDirection.x * torsoLength * .28,
    y: shoulderMid.y + torsoDirection.y * torsoLength * .28
  };
  const waistCenter = {
    x: shoulderMid.x + torsoDirection.x * torsoLength * .68,
    y: shoulderMid.y + torsoDirection.y * torsoLength * .68
  };
  companionEllipse(context, chestCenter, shoulderWidth * .51, torsoLength * .42, torsoRotation, bodyGradient);
  companionBlobSegment(context, chestCenter, waistCenter, torsoLength * .31, torsoLength * .255, bodyGradient);
  companionEllipse(context, hipMid, hipWidth * .57, torsoLength * .26, torsoRotation, bodyGradient);

  drawLimb([0,2,4], armRadii);
  drawLimb([1,3,5], armRadii);
  companionBlobSegment(context, head, shoulderMid, headRadius * .42, torsoLength * .19, bodyGradient);
  companionEllipse(context, head, headRadius * .91, headRadius * 1.06, torsoRotation, bodyGradient);

  [4,5].forEach(index => {
    if (points[index].visibility < .3) return;
    companionEllipse(context, project(points[index]), torsoLength * .11, torsoLength * .125, 0, bodyGradient);
  });
  [[10,12,14],[11,13,15]].forEach(([ankleIndex, heelIndex, toeIndex]) => {
    if (points[ankleIndex].visibility < .3) return;
    const ankle = project(points[ankleIndex]);
    const heel = points[heelIndex].visibility > .3 ? project(points[heelIndex]) : ankle;
    const toe = points[toeIndex].visibility > .3 ? project(points[toeIndex]) : ankle;
    const footStart = { x: (ankle.x + heel.x) / 2, y: (ankle.y + heel.y) / 2 };
    companionBlobSegment(context, footStart, toe, torsoLength * .12, torsoLength * .085, bodyGradient);
  });

  context.shadowColor = "transparent";
  context.strokeStyle = "rgba(242,193,78,.9)";
  context.lineWidth = compact ? 1.6 : 2.2;
  const activeFoot = [project(points[14]), project(points[15])].sort((a,b) => b.y - a.y)[0];
  context.beginPath();
  context.ellipse(activeFoot.x, activeFoot.y + torsoLength * .12, torsoLength * .28, torsoLength * .07, 0, 0, Math.PI * 2);
  context.stroke();
  if (keyPose && points[accentJoint]?.visibility > .3) {
    const accent = project(points[accentJoint]);
    context.strokeStyle = "rgba(242,193,78,.46)";
    context.beginPath();
    context.arc(accent.x, accent.y, torsoLength * .18, 0, Math.PI * 2);
    context.stroke();
  }
}

function drawMovementChart(canvas, values, { path = false } = {}) {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(255,255,255,.08)";
  context.lineWidth = 1;
  for (let index = 1; index < 5; index++) {
    const y = canvas.height * index / 5;
    context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke();
  }
  if (!values?.length) return;
  const points = path
    ? values.map(value => ({ x: 30 + value.x * (canvas.width - 60), y: 24 + value.y * (canvas.height - 48) }))
    : values.map((value, index) => ({ x: 24 + index * (canvas.width - 48) / Math.max(1, values.length - 1), y: canvas.height - 24 - Math.min(1, value / Math.max(.01, Math.max(...values))) * (canvas.height - 48) }));
  context.strokeStyle = "#f2c14e";
  context.lineWidth = 5;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  points.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
  context.stroke();
  if (path) {
    context.fillStyle = "#efede7";
    [points[0], points.at(-1)].forEach(point => { context.beginPath(); context.arc(point.x, point.y, 7, 0, Math.PI * 2); context.fill(); });
  }
}

function originalSpeedFrameIndex(sequence, elapsed, durationSeconds = interval) {
  if (!sequence?.length) return 0;
  const loopDuration = Math.max(.1, durationSeconds) * 1000;
  const position = ((elapsed % loopDuration) + loopDuration) % loopDuration;
  return Math.min(sequence.length - 1, Math.floor(position / loopDuration * sequence.length));
}

function movementFeedback(metrics) {
  if (!metrics || metrics.coverage < .45) return {
    confidence: "证据偏低",
    trajectoryTitle: "这段视频先别急着下结论",
    trajectoryCopy: "身体没有持续完整入镜。换一段全身无遮挡的视频，我才能认真看你的重心路径。",
    frameTitle: "框架暂时看不全",
    frameCopy: "这不是你跳得小，是镜头没有把动作空间交代完整。",
    textureTitle: "质感先按住不评",
    textureCopy: "没有稳定轨迹时谈质感，多少有点靠想象。",
    focus: "下一遍：先让全身持续入镜"
  };
  const widthRatio = metrics.bodyWidthPeak / Math.max(.08, metrics.bodyHeightMean);
  const trajectoryWide = metrics.horizontalRange > .55;
  const frameOpen = widthRatio > .62;
  const textureFocus = metrics.pauseRatio > .28
    ? "把停顿做成选择，别做成卡住"
    : metrics.speedVariation > 1.15
      ? "让快慢变化有准备，不要突然抢镜"
      : "保持现在的连续性，再跟音乐校准重拍";
  return {
    confidence: `轨迹覆盖 ${Math.round(metrics.coverage * 100)}%`,
    trajectoryTitle: trajectoryWide ? "重心真的有出去，不是在原地假忙" : "重心比较恋家，还可以再走远一点",
    trajectoryCopy: `身体中心横向移动约 ${metrics.horizontalRange.toFixed(2)} 个身高、纵向约 ${metrics.verticalRange.toFixed(2)} 个身高。这描述轨迹范围，不代表动作好坏。`,
    frameTitle: frameOpen ? "框架有打开，不用把自己缩小" : "框架有点客气，可以再大方一点",
    frameCopy: `本段最大横向身体占位约为平均身高的 ${widthRatio.toFixed(2)} 倍。是否“够大”仍要和老师示范、镜头距离一起看。`,
    textureTitle: metrics.pauseRatio > .28 ? "停顿有点黏，像鞋底舍不得地板" : metrics.speedVariation > 1.15 ? "收放很有戏，但转折有点抢镜" : "速度线索挺顺，质感没有硬凹",
    textureCopy: `低速停顿约 ${Math.round(metrics.pauseRatio * 100)}%，速度波动系数 ${metrics.speedVariation.toFixed(2)}。这是质感线索，不是最终质感评分；还需要音乐拍点和老师示范。`,
    focus: `下一遍只练一件事：${textureFocus}`,
    widthRatio
  };
}

function renderMovementEvidence(metrics) {
  const feedback = movementFeedback(metrics);
  classMovementEvidence.hidden = false;
  classCoachSummary.hidden = false;
  classTrajectoryConfidence.textContent = feedback.confidence;
  classFrameConfidence.textContent = feedback.confidence;
  classTextureConfidence.textContent = metrics ? "线索，不是评分" : "没有视频证据";
  classTrajectoryTitle.textContent = feedback.trajectoryTitle;
  classTrajectoryCopy.textContent = feedback.trajectoryCopy;
  classFrameTitle.textContent = feedback.frameTitle;
  classFrameCopy.textContent = feedback.frameCopy;
  classTextureTitle.textContent = feedback.textureTitle;
  classTextureCopy.textContent = feedback.textureCopy;
  classCoachFocus.textContent = feedback.focus;
  drawMovementChart(classTrajectoryCanvas, metrics?.centerPath || [], { path: true });
  drawMovementChart(classTextureCanvas, metrics?.speedSeries || []);
  classFrameVisual.style.setProperty("--frame-width", `${Math.max(28, Math.min(92, (feedback.widthRatio || .45) * 100))}%`);
}

async function renderClassMoveCandidates(candidates) {
  cancelAnimationFrame(classMoveAnimationFrame);
  classMoveCandidates.replaceChildren();
  if (!candidates.length) {
    classMoveCandidates.innerHTML = '<div class="practice-record-empty"><strong>没有稳定动作候选</strong><span>可在下方手动补充动作名称。</span></div>';
    return;
  }
  const library = await getPoseLibrary();
  const animations = [];
  candidates.forEach(candidate => {
    const item = library.items.find(entry => entry.name === candidate.name);
    if (!item) return;
    const card = document.createElement("article");
    card.className = "class-move-card";
    const evidence = candidate.source === "transcript"
      ? "课堂文字明确提到"
      : `${candidate.hits} 个视频片段匹配 · 需要人工确认`;
    card.innerHTML = `<canvas width="180" height="210" aria-label="${escapeRecordText(candidate.name)} 动作搭子"></canvas><div><strong>${escapeRecordText(candidate.name)}</strong><small>${evidence}</small><em>候选，别让小人替你拍板</em></div>`;
    classMoveCandidates.append(card);
    const sourceDuration = elements.find(element => element.name === candidate.name)?.duration || interval;
    animations.push({
      canvas: card.querySelector("canvas"),
      name: candidate.name,
      timeline: buildCompanionTimeline(item.sequence, sourceDuration)
    });
  });
  const startedAt = performance.now();
  const animate = now => {
    animations.forEach(animation => {
      const elapsed = Math.max(0, now - startedAt);
      const entry = companionTimelineSample(animation.timeline, elapsed);
      if (!entry) return;
      drawSoftCompanion(animation.canvas, entry.frame, {
        previousFrame: entry.previousFrame,
        accentJoint: entry.accentJoint,
        keyPose: entry.keyPose
      });
    });
    classMoveAnimationFrame = requestAnimationFrame(animate);
  };
  classMoveAnimationFrame = requestAnimationFrame(animate);
}

function professionalClassSummary({ teacher, moves, points, exercises, problems, findings, hasVideo }) {
  const teacherText = teacher ? (teacher.endsWith("老师") ? teacher : `${teacher}老师`) : "本节课";
  const moveText = moves.length ? `围绕 ${moves.join("、")} 的动作路径与身体控制展开` : "本节动作元素需要确认";
  const exerciseText = exercises.length ? `课堂练习包括${exercises.slice(0, 3).join("；")}` : "课堂练习内容需要确认";
  const pointText = points.length ? `教学要点集中在${points.slice(0, 3).join("；")}` : "教学要点需要确认老师口述或课堂文字";
  const problemText = problems.length ? `课堂明确提到的问题是${problems.slice(0, 3).join("；")}` : "课堂文字没有明确记录个人问题";
  if (!hasVideo) {
    return `${teacherText}${moveText}。${exerciseText}。${pointText}。${problemText}。本次未上传课堂视频，因此不判断个人身体轨迹、动作框架或速度收放；Groove、Bounce、拍点、发力顺序与质感均需要结合视频、音乐和老师示范确认。`;
  }
  const findingText = findings.length ? findings[0] : "个人二维姿态轨迹需要确认";
  return `${teacherText}${moveText}。${exerciseText}。${pointText}。${problemText}。从身体轨迹看，${findingText} 当前只能把重心路径、动作框架、速度收放作为复盘线索；Groove、Bounce、拍点、发力顺序与质感是否到位，需要结合音乐和老师示范确认。`;
}

function formatClipTime(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safe / 60);
  return `${minutes}:${String(Math.floor(safe % 60)).padStart(2, "0")}`;
}

function buildClassClipDrafts(videoAnalysis, moves = []) {
  if (!selectedClassVideo || !videoAnalysis?.duration) return [];
  const drafts = [];
  const usedStarts = [];
  const addDraft = (segment, suggestedName, source) => {
    if (!segment || usedStarts.some(start => Math.abs(start - segment.start) < 1.2)) return;
    const start = Math.max(0, Math.min(segment.start, Math.max(0, videoAnalysis.duration - 1)));
    const duration = Math.max(.8, Math.min(segment.duration || 4.9, videoAnalysis.duration - start));
    usedStarts.push(start);
    drafts.push({
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${drafts.length}`,
      start,
      duration,
      elementName: names.includes(suggestedName) ? suggestedName : (moves.find(name => names.includes(name)) || ""),
      source
    });
  };
  (videoAnalysis.candidates || []).forEach(candidate => addDraft(candidate.bestSegment, candidate.name, "动作匹配"));
  [...(videoAnalysis.scanSegments || [])]
    .sort((a, b) => b.movement - a.movement)
    .forEach(segment => addDraft(segment, segment.matches?.[0]?.name, "动作片段"));
  if (!drafts.length) {
    const duration = Math.min(5, videoAnalysis.duration);
    [0, Math.max(0, videoAnalysis.duration / 2 - duration / 2)].forEach(start =>
      addDraft({ start, duration }, moves[0], "待确认片段")
    );
  }
  return drafts.slice(0, 4);
}

function previewClassClip(draft) {
  if (!selectedClassVideo || classVideoPreview.hidden) return;
  const end = draft.start + draft.duration;
  classVideoPreview.currentTime = draft.start;
  classVideoPreview.scrollIntoView({ behavior: "smooth", block: "center" });
  const stopAtEnd = () => {
    if (classVideoPreview.currentTime < end && !classVideoPreview.ended) return;
    classVideoPreview.pause();
    classVideoPreview.currentTime = draft.start;
    classVideoPreview.removeEventListener("timeupdate", stopAtEnd);
  };
  classVideoPreview.addEventListener("timeupdate", stopAtEnd);
  classVideoPreview.play().catch(() => {});
}

async function storeClassClipDraft(draft, destination, card) {
  if (!selectedClassVideo) return;
  const select = card.querySelector("select");
  const note = card.querySelector("input");
  const elementName = select.value;
  if (!elementName) {
    classClipStatus.textContent = "请先选择这个片段属于哪个元素。";
    select.focus();
    return;
  }
  const buttons = card.querySelectorAll("button");
  buttons.forEach(button => { button.disabled = true; });
  classClipStatus.textContent = `ChatCut 正在生成 ${draft.duration.toFixed(1)} 秒短片；只处理这一段。`;
  try {
    const blob = await createClassVariationBlob(selectedClassVideo, draft);
    if (!(blob instanceof Blob) || !blob.size) throw new Error("EMPTY_CLASS_VARIATION");
    await saveClassVariation({
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      elementName,
      note: note.value.trim(),
      destination,
      classTitle: classTitle.value.trim(),
      classDate: classDate.value,
      teacher: currentClassTeacher(),
      sourceFileName: selectedClassVideo.name,
      start: draft.start,
      duration: draft.duration,
      video: blob,
      createdAt: new Date().toISOString()
    });
    card.classList.add("is-saved");
    classClipStatus.textContent = destination === "queue"
      ? `${elementName} 变形已加入待练清单。`
      : `${elementName} 变形已存入元素集合。`;
    await renderClassVariations();
  } catch {
    classClipStatus.textContent = "短片没有保存成功；原视频和分析结果都还在，可以直接重试。";
  } finally {
    buttons.forEach(button => { button.disabled = false; });
  }
}

function renderClassClipDrafts(videoAnalysis, moves) {
  classClipDrafts = buildClassClipDrafts(videoAnalysis, moves);
  classClipCandidates.replaceChildren();
  classChatcutClips.hidden = !classClipDrafts.length;
  classClipDrafts.forEach((draft, index) => {
    const card = document.createElement("article");
    card.className = "class-clip-card";
    const options = names.map(name => `<option value="${name}"${name === draft.elementName ? " selected" : ""}>${name}</option>`).join("");
    card.innerHTML = `
      <div class="class-clip-card__time"><b>${String(index + 1).padStart(2, "0")}</b><span>${formatClipTime(draft.start)}–${formatClipTime(draft.start + draft.duration)}</span></div>
      <div class="class-clip-card__body">
        <label><span>归属元素</span><select><option value="">请选择元素</option>${options}</select></label>
        <label><span>这是什么变形（可选）</span><input type="text" maxlength="120" placeholder="例如：重心更低、向左移动版" /></label>
        <small>${draft.source} · ${draft.duration.toFixed(1)} 秒 · 保存时才真正剪片</small>
      </div>
      <div class="class-clip-card__actions"><button type="button" data-action="preview">预览</button><button type="button" data-action="queue">加入待练</button><button type="button" data-action="library">存入元素集合</button></div>`;
    card.querySelector('[data-action="preview"]').addEventListener("click", () => previewClassClip(draft));
    card.querySelector('[data-action="queue"]').addEventListener("click", () => storeClassClipDraft(draft, "queue", card));
    card.querySelector('[data-action="library"]').addEventListener("click", () => storeClassClipDraft(draft, "library", card));
    classClipCandidates.append(card);
  });
  classClipStatus.textContent = classClipDrafts.length
    ? `ChatCut 已准备 ${classClipDrafts.length} 个候选片段。它们是可编辑草稿，不会自动占用存储。`
    : "没有课堂视频，当前只保留文字要点，不生成片段。";
}

analyzeClass.addEventListener("click", async () => {
  if (!classAnalysisForm.reportValidity()) return;
  const transcript = classTranscript.value.trim();
  if (!selectedClassVideo && !transcript) {
    classAnalysisStatus.textContent = "请至少上传一段课堂视频，或粘贴一份课堂记录。";
    return;
  }
  analyzeClass.disabled = true;
  analyzeClass.textContent = "正在分析…";
  classAnalysisStatus.textContent = selectedClassVideo
    ? "正在分段扫描视频动作，并整理课堂文字；长视频需要一点时间。"
    : "正在整理课堂文字。";
  try {
    if (classPersonDetectionPending) {
      classAnalysisStatus.textContent = "正在生成人物确认截图，请稍等几秒再开始分析。";
      return;
    }
    if (selectedClassVideo && !classPeopleAcceptance?.passed) {
      classAnalysisStatus.textContent = "开场人物识别尚未达到至少 4 人。系统已完成自动复检，请点击“重新识别开场人物”再试；课堂文字仍会保留。";
      classPersonPicker.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (selectedClassVideo && classDetectedPeople.length > 1 && !selectedClassPerson) {
      classAnalysisStatus.textContent = "请先在人物截图中点选哪一个是你，再开始个人轨迹分析。";
      classPersonPicker.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const [videoAnalysis, parsed] = await Promise.all([
      analyzeClassVideo(selectedClassVideo),
      parseClassTranscript(transcript)
    ]);
    const data = parsed.data || {};
    const uncertainMoves = new Set(uncertainMoveNames(data));
    const moves = [...new Set([
      ...videoAnalysis.candidates.map(item => item.name),
      ...(data.knownMoves || []).filter(name => !uncertainMoves.has(name)),
      ...(data.otherMoves || []).filter(name => !uncertainMoves.has(name))
    ])];
    classMovesResult.value = moves.length ? moves.join("、") : "暂未识别到稳定的动作候选（可手动补充）";
    const exercises = data.exercises || [];
    classPointsResult.value = [
      ...(exercises.length ? ["【课堂练习】", ...exercises.map(item => `• ${item}`)] : ["【课堂练习】", "• 需要确认：暂未从课堂文字中提取到明确练习内容"]),
      "",
      ...((data.practicePoints || []).length ? ["【练习要点】", ...(data.practicePoints || []).map(item => `• ${item}`)] : ["【练习要点】", "• 需要确认：暂未从课堂文字中提取到明确练习要点"])
    ].join("\n");
    const explicitProblems = data.problems || [];
    classProblemsResult.value = [
      ...(explicitProblems.length ? ["【课堂明确提到的问题】", ...explicitProblems.map(item => `• ${item}`)] : ["【课堂明确提到的问题】", "• 需要确认：课堂文字没有明确记录问题"]),
      "",
      ...(videoAnalysis.findings.length ? ["【视频轨迹发现】", ...videoAnalysis.findings.map(item => `• ${item}`)] : ["【视频轨迹发现】", "• 需要确认：没有形成可靠的视频轨迹发现"])
    ].join("\n");
    const confirmations = [
      ...(data.needsConfirmation || []),
      ...(!transcript ? ["未提供课堂转写，老师口述中的练习、要点和问题尚未提取"] : []),
      ...(!selectedClassVideo ? ["未上传课堂视频，无法分析人物、动作轨迹、框架和质感线索"] : []),
      ...(!selectedClassVideo || classPeopleAcceptance?.passed ? [] : [`开场仅识别到 ${classPeopleAcceptance?.detectedPeople ?? 0} 人，未达到至少 4 人的验收要求`]),
      ...(!selectedClassVideo || classTeacherPresence() ? [] : ["尚未确认课堂视频里是否有老师"]),
      ...(!selectedClassVideo || classTeacherPresence() !== "yes" || !classTeacherDetection?.needsConfirmation ? [] : ["核心老师身份与示范片段归属需要人工确认"]),
      ...(!videoAnalysis.candidates.length && selectedClassVideo ? ["视频动作元素没有形成稳定匹配，需要人工确认动作名称"] : [])
    ];
    classConfirmationsResult.value = confirmations.length
      ? confirmations.map(item => `• 需要确认：${String(item).replace(/^需要确认[：:]?\s*/, "")}`).join("\n")
      : "已通过当前证据检查；仍建议保存前人工复核课堂文字与老师身份。";
    classSummaryResult.value = professionalClassSummary({ teacher: currentClassTeacher(), moves, points: data.practicePoints || [], exercises, problems: explicitProblems, findings: videoAnalysis.findings, hasVideo: Boolean(selectedClassVideo) });
    lastClassVideoAnalysis = videoAnalysis;
    const visualCandidates = moves.filter(name => names.includes(name)).slice(0, 5).map(name =>
      videoAnalysis.candidates.find(candidate => candidate.name === name) || { name, hits: 0, score: 0, source: "transcript" }
    );
    await renderClassMoveCandidates(visualCandidates);
    renderClassClipDrafts(videoAnalysis, moves);
    renderMovementEvidence(videoAnalysis.metrics);
    const companionCandidate = visualCandidates.find(candidate => names.includes(candidate.name));
    if (companionCandidate) {
      const library = await getPoseLibrary();
      const companionSequence = library.items.find(item => item.name === companionCandidate.name)?.sequence;
      if (companionSequence?.length) {
        classNoteCompanion.hidden = false;
        classNoteCompanionName.textContent = `${companionCandidate.name} 动作搭子`;
        const sourceDuration = elements.find(element => element.name === companionCandidate.name)?.duration || interval;
        const companionTimeline = buildCompanionTimeline(companionSequence, sourceDuration);
        const companionStartedAt = performance.now();
        const animateCompanion = now => {
          if (classAnalysisResult.hidden || classNoteCompanion.hidden) return;
          const entry = companionTimelineSample(companionTimeline, now - companionStartedAt);
          if (!entry) return;
          drawSoftCompanion(classNoteCompanionCanvas, entry.frame, {
            previousFrame: entry.previousFrame,
            accentJoint: entry.accentJoint,
            keyPose: entry.keyPose
          });
          requestAnimationFrame(animateCompanion);
        };
        requestAnimationFrame(animateCompanion);
      }
    } else {
      classNoteCompanion.hidden = true;
    }
    classAnalysisModel.textContent = selectedClassVideo
      ? `个人轨迹分析 + 动态动作候选 + ${parsed.model || "AI 文字整理"}`
      : `课堂文字整理 + ${parsed.model || "本地证据检查"}`;
    classAnalysisResult.hidden = false;
    classAnalysisStatus.textContent = confirmations.length
      ? `课堂分析已生成，其中 ${confirmations.length} 项标记为“需要确认”。复核后再保存。`
      : "课堂分析已生成，当前证据检查通过；请复核后再保存。";
    classAnalysisResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch {
    classAnalysisStatus.textContent = "这次没有完成分析，原视频和文字仍在表单中，可以直接重试。";
  } finally {
    analyzeClass.disabled = false;
    analyzeClass.textContent = "✦ 重新生成课堂分析";
  }
});

function resetClassAnalysisForm() {
  clearClassVideo();
  clearTeacherDemoVideo();
  clearGeneratedTeacherCut();
  clearClassPersonPicker();
  classAnalysisForm.reset();
  classDate.value = dailyDateKey;
  classAnalysisResult.hidden = true;
  classMovesResult.value = "";
  classPointsResult.value = "";
  classProblemsResult.value = "";
  classConfirmationsResult.value = "";
  classSummaryResult.value = "";
  classMoveCandidates.replaceChildren();
  classClipDrafts = [];
  classClipCandidates.replaceChildren();
  classChatcutClips.hidden = true;
  classMovementEvidence.hidden = true;
  classCoachSummary.hidden = true;
  classNoteCompanion.hidden = true;
  analyzeClass.textContent = "✦ 生成课堂分析";
}

discardClassAnalysis.addEventListener("click", () => {
  classAnalysisResult.hidden = true;
  classClipDrafts = [];
  classClipCandidates.replaceChildren();
  classChatcutClips.hidden = true;
  classAnalysisStatus.textContent = "分析草稿已清除，原视频和课堂文字仍然保留。";
});

replayWithFocus.addEventListener("click", async () => {
  if (!selectedClassVideo || classVideoPreview.hidden) return;
  classVideoPreview.currentTime = 0;
  classVideoPreview.scrollIntoView({ behavior: "smooth", block: "center" });
  try { await classVideoPreview.play(); } catch { /* controls remain available */ }
});

async function renderClassAnalyses() {
  classRecordVideoUrls.forEach(url => URL.revokeObjectURL(url));
  classRecordVideoUrls = [];
  try {
    const records = await readClassAnalyses();
    const storedTeachers = readClassTeachers();
    const mergedTeachers = [...new Set([...records.map(record => record.teacher).filter(Boolean), ...storedTeachers])].slice(0, 30);
    localStorage.setItem(classTeachersStorageKey, JSON.stringify(mergedTeachers));
    renderClassTeachers(classTeacher.value === "__new__" ? classTeacherNew.value.trim() : classTeacher.value);
    classAnalysisCount.textContent = `${records.length} 节课堂`;
    classAnalysisList.replaceChildren();
    if (!records.length) {
      classAnalysisList.innerHTML = '<div class="practice-record-empty"><strong>还没有课堂分析</strong><span>上传课堂视频或粘贴课堂记录，生成第一份可回看的课堂总结。</span></div>';
      return;
    }
    records.forEach(record => {
      const article = document.createElement("article");
      article.className = "class-record";
      const teacher = record.teacher ? `老师：${escapeRecordText(record.teacher)}` : "未填写老师";
      article.innerHTML = `
        <div class="class-record__head">
          <time>${escapeRecordText(record.classDate || "日期未填")}</time>
          <div><strong>${escapeRecordText(record.title)}</strong><span>${teacher}</span></div>
          <button type="button" aria-expanded="false">查看分析</button>
        </div>
        <div class="class-record__body" hidden>
          ${record.video?.blob instanceof Blob ? '<video controls playsinline preload="metadata"></video>' : ""}
          <div class="class-record__section"><b>动作候选</b><p>${escapeRecordText(record.moves || "未填写")}</p></div>
          <div class="class-record__section"><b>练习要点</b><p>${escapeRecordText(record.points || "未填写")}</p></div>
          <div class="class-record__section"><b>今天的问题</b><p>${escapeRecordText(record.problems || "未填写")}</p></div>
          <div class="class-record__section"><b>需要确认</b><p>${escapeRecordText(record.confirmations || "无额外待确认项")}</p></div>
          <div class="class-record__section"><b>课堂总结</b><p>${escapeRecordText(record.summary || "未填写")}</p></div>
          ${record.teacherCut?.video instanceof Blob ? `<div class="class-record__section"><b>老师示范候选</b><video class="class-record__teacher-cut" controls playsinline preload="metadata"></video><p>${escapeRecordText(record.teacherCut.status || "需要确认老师身份")}</p></div>` : ""}
          ${record.transcript ? `<div class="class-record__section"><b>原始课堂文字</b><p>${escapeRecordText(record.transcript)}</p></div>` : ""}
          <button class="class-record__delete" type="button">删除这份课堂分析</button>
        </div>`;
      const body = article.querySelector(".class-record__body");
      const toggle = article.querySelector(".class-record__head button");
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        toggle.textContent = expanded ? "查看分析" : "收起分析";
        body.hidden = expanded;
      });
      const video = article.querySelector("video");
      if (video) {
        const url = URL.createObjectURL(record.video.blob);
        classRecordVideoUrls.push(url);
        video.src = url;
      }
      const teacherCutVideo = article.querySelector(".class-record__teacher-cut");
      if (teacherCutVideo && record.teacherCut?.video instanceof Blob) {
        const teacherUrl = URL.createObjectURL(record.teacherCut.video);
        classRecordVideoUrls.push(teacherUrl);
        teacherCutVideo.src = teacherUrl;
        teacherCutVideo.currentTime = record.teacherCut.segmentStart || 0;
        teacherCutVideo.style.objectPosition = `${record.teacherCut.center?.x || 50}% ${record.teacherCut.center?.y || 50}%`;
        teacherCutVideo.addEventListener("timeupdate", () => {
          const end = (record.teacherCut.segmentStart || 0) + (record.teacherCut.segmentDuration || 0);
          if (end && teacherCutVideo.currentTime >= end) {
            teacherCutVideo.pause();
            teacherCutVideo.currentTime = record.teacherCut.segmentStart || 0;
          }
        });
      }
      article.querySelector(".class-record__delete").addEventListener("click", async () => {
        await deleteClassAnalysis(record.id);
        await renderClassAnalyses();
      });
      classAnalysisList.append(article);
    });
  } catch {
    classAnalysisList.innerHTML = '<div class="practice-record-empty"><strong>暂时无法打开课堂档案</strong><span>请确认浏览器允许网站保存本地数据。</span></div>';
  }
}

classAnalysisForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (classAnalysisResult.hidden || !classAnalysisForm.reportValidity()) {
    classAnalysisStatus.textContent = "请先生成课堂分析，再确认保存。";
    return;
  }
  const saveButton = document.querySelector("#saveClassAnalysis");
  saveButton.disabled = true;
  classAnalysisStatus.textContent = "正在保存课堂档案到这台设备…";
  try {
    rememberClassTeacher();
    await saveClassAnalysis({
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: classTitle.value.trim(),
      classDate: classDate.value,
      teacher: currentClassTeacher(),
      transcript: classTranscript.value.trim(),
      moves: classMovesResult.value.trim(),
      points: classPointsResult.value.trim(),
      problems: classProblemsResult.value.trim(),
      confirmations: classConfirmationsResult.value.trim(),
      summary: classSummaryResult.value.trim(),
      trajectoryMetrics: lastClassVideoAnalysis?.metrics || null,
      selectedPersonCenter: selectedClassPerson?.center || null,
      detectedPeopleCount: classPeopleAcceptance?.detectedPeople || 0,
      teacherPresence: classTeacherPresence() || "unknown",
      teacherCut: (selectedTeacherDemoVideo || selectedClassVideo) && selectedClassTeacherCandidate ? {
        video: generatedTeacherCutBlob || selectedTeacherDemoVideo || selectedClassVideo,
        generated: Boolean(generatedTeacherCutBlob),
        source: selectedTeacherDemoVideo ? "extra-teacher-demo" : "class-video",
        personIndex: selectedClassTeacherCandidate.personIndex,
        segmentStart: selectedClassTeacherCandidate.segmentStart,
        segmentDuration: selectedClassTeacherCandidate.segmentDuration,
        crop: selectedClassTeacherCandidate.crop,
        center: selectedTeacherCropCenter(selectedClassTeacherCandidate),
        status: classTeacherDetection?.needsConfirmation ? "需要确认：核心老师身份与示范片段归属" : "系统已选核心老师，建议人工复核"
      } : null,
      video: selectedClassVideo ? {
        name: selectedClassVideo.name,
        type: selectedClassVideo.type,
        size: selectedClassVideo.size,
        blob: selectedClassVideo
      } : null,
      createdAt: new Date().toISOString()
    });
    resetClassAnalysisForm();
    await renderClassAnalyses();
    classAnalysisStatus.textContent = "课堂分析已保存在这台设备。第一版暂不上传云端。";
  } catch {
    classAnalysisStatus.textContent = "保存失败；视频可能超过浏览器可用空间，请先压缩后重试。";
  } finally {
    saveButton.disabled = false;
  }
});

classDate.value = dailyDateKey;
renderClassTeachers();
void renderClassAnalyses();
void renderClassVariations();

const prototypeElements = ["Running Man", "Roger Rabbit", "Arm Wave"].map(name => elements.find(item => item.name === name));

function renderPrototypeCards() {
  prototypeElements.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "prototype-card";
    button.dataset.prototypeIndex = index;
    button.innerHTML = `<img src="${item.poster}" alt="${item.name} 动作封面"><span class="prototype-card__number">#${String(item.id).padStart(2, "0")}</span><span class="prototype-card__hint">点击展开 ↗</span><strong>${item.name}</strong><small>${item.category === "hand" ? "手部元素" : "脚步元素"}</small>`;
    button.addEventListener("click", () => openViewer(index, button));
    prototypeTrack.append(button);
  });
}

function setViewerContent(index) {
  prototypeIndex = (index + prototypeElements.length) % prototypeElements.length;
  const item = prototypeElements[prototypeIndex];
  viewerVideo.src = item.clip;
  viewerVideo.poster = item.poster;
  viewerVideo.currentTime = item.start;
  viewerVideo.muted = false;
  viewerVideo.volume = 1;
  document.querySelector("#viewerNumber").textContent = `#${String(item.id).padStart(2, "0")}`;
  document.querySelector("#viewerTitle").textContent = item.name;
  document.querySelector("#viewerCategory").textContent = `${item.category === "hand" ? "手部元素" : "脚步元素"} · ${item.duration.toFixed(1)} 秒`;
  document.querySelector("#viewerProgressBar").style.width = "0%";
  viewerVideo.play().catch(() => {});
}

function transition(update) {
  if (document.startViewTransition) return document.startViewTransition(update);
  update();
  return null;
}

function openViewer(index, opener) {
  stopVideo(activeVideo);
  prototypeOpener = opener;
  opener.style.viewTransitionName = "motion-card";
  transition(() => {
    opener.style.viewTransitionName = "none";
    viewerPanel.style.viewTransitionName = "motion-card";
    motionViewer.hidden = false;
    document.body.classList.add("viewer-open");
    setViewerContent(index);
  });
}

function closeViewer() {
  if (motionViewer.hidden) return;
  viewerVideo.pause();
  viewerPanel.style.viewTransitionName = "motion-card";
  transition(() => {
    viewerPanel.style.viewTransitionName = "none";
    if (prototypeOpener) prototypeOpener.style.viewTransitionName = "motion-card";
    motionViewer.hidden = true;
    document.body.classList.remove("viewer-open");
  });
  setTimeout(() => { if (prototypeOpener) prototypeOpener.style.viewTransitionName = "none"; }, 500);
}

function changePrototype(direction) {
  viewerPanel.classList.remove("is-switching");
  void viewerPanel.offsetWidth;
  viewerPanel.classList.add("is-switching");
  prototypeOpener = prototypeTrack.querySelector(`[data-prototype-index="${(prototypeIndex + direction + prototypeElements.length) % prototypeElements.length}"]`);
  setViewerContent(prototypeIndex + direction);
}

renderPrototypeCards();
document.querySelector("#viewerClose").addEventListener("click", closeViewer);
document.querySelector("#viewerPrev").addEventListener("click", () => changePrototype(-1));
document.querySelector("#viewerNext").addEventListener("click", () => changePrototype(1));
motionViewer.addEventListener("click", event => { if (event.target === motionViewer) closeViewer(); });
document.addEventListener("keydown", event => {
  if (motionViewer.hidden) return;
  if (event.key === "Escape") closeViewer();
  if (event.key === "ArrowLeft") changePrototype(-1);
  if (event.key === "ArrowRight") changePrototype(1);
});
let swipeStart = 0;
viewerPanel.addEventListener("pointerdown", event => { swipeStart = event.clientX; });
viewerPanel.addEventListener("pointerup", event => {
  const distance = event.clientX - swipeStart;
  if (Math.abs(distance) > 55) changePrototype(distance > 0 ? -1 : 1);
});
viewerVideo.addEventListener("timeupdate", () => {
  const item = prototypeElements[prototypeIndex];
  const progress = Math.min(Math.max(viewerVideo.currentTime - item.start, 0) / item.duration, 1);
  document.querySelector("#viewerProgressBar").style.width = `${progress * 100}%`;
  if (viewerVideo.currentTime >= item.start + item.duration) {
    viewerVideo.pause();
    viewerVideo.currentTime = item.start;
    document.querySelector("#viewerProgressBar").style.width = "0%";
  }
});

function filterCards() {
  const query = searchInput.value.trim().toLowerCase();
  let count = 0;
  grid.querySelectorAll(".card").forEach(card => {
    const categoryMatch = activeCategory === "all" || card.dataset.category === activeCategory;
    const visible = categoryMatch && card.dataset.name.includes(query);
    card.hidden = !visible;
    if (visible) count++;
    else stopVideo(card.querySelector("video"));
  });
  resultCount.textContent = count;
  emptyState.hidden = count !== 0;
}

filterButtons.forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  filterButtons.forEach(item => item.classList.toggle("is-active", item === button));
  filterCards();
}));

searchInput.addEventListener("input", filterCards);
clearSearch.addEventListener("click", () => { searchInput.value = ""; filterCards(); searchInput.focus(); });
document.addEventListener("keydown", event => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
});

const shotInput = document.querySelector("#shotInput");
const shotPick = document.querySelector("#shotPick");
const shotDropzone = document.querySelector("#shotDropzone");
const shotPreview = document.querySelector("#shotPreview");
const shotVideoPreview = document.querySelector("#shotVideoPreview");
const poseOverlay = document.querySelector("#poseOverlay");
const shotPreviewEmpty = document.querySelector("#shotPreviewEmpty");
const shotResults = document.querySelector("#shotResults");
const shotStatus = document.querySelector("#shotStatus");
const savedCollection = document.querySelector("#savedCollection");
const clearCollectionButton = document.querySelector("#clearCollection");
const collectionCount = document.querySelector("#collectionCount");
const matchVerdict = document.querySelector("#matchVerdict");
const newActionPanel = document.querySelector("#newActionPanel");
const newActionName = document.querySelector("#newActionName");
const saveNewActionButton = document.querySelector("#saveNewAction");
const collectionStorageKey = "hiphop-screenshot-library-v1";
let currentScreenshot = "";
let currentMediaType = "image";
let currentVideoUrl = "";
let poseModulePromise = null;
let poseLibraryPromise = null;

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

async function prepareScreenshot(file) {
  const source = URL.createObjectURL(file);
  try {
    const image = await loadImage(source);
    const maxWidth = 480;
    const maxHeight = 720;
    const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight, 1);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", .74);
  } finally {
    URL.revokeObjectURL(source);
  }
}

function waitForMedia(target, eventName) {
  return new Promise((resolve, reject) => {
    const onReady = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error("media-error")); };
    const cleanup = () => {
      target.removeEventListener(eventName, onReady);
      target.removeEventListener("error", onError);
    };
    target.addEventListener(eventName, onReady, { once: true });
    target.addEventListener("error", onError, { once: true });
  });
}

function seekVideo(video, time) {
  return new Promise((resolve, reject) => {
    const target = Math.min(Math.max(time, 0), Math.max(video.duration - .05, 0));
    if (video.readyState >= 2 && Math.abs(video.currentTime - target) < .03) {
      resolve();
      return;
    }
    const onSeeked = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error("video-seek-error")); };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };
    video.addEventListener("seeked", onSeeked, { once: true });
    video.addEventListener("error", onError, { once: true });
    video.currentTime = target;
  });
}

function videoFrameDataUrl(video) {
  const maxWidth = 480;
  const maxHeight = 720;
  const scale = Math.min(maxWidth / video.videoWidth, maxHeight / video.videoHeight, 1);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
  canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", .74);
}

async function prepareVideo(file) {
  const source = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  video.src = source;
  if (video.readyState < 1) await waitForMedia(video, "loadedmetadata");
  if (!Number.isFinite(video.duration) || video.duration <= 0 || !video.videoWidth) {
    URL.revokeObjectURL(source);
    throw new Error("invalid-video");
  }
  return { source, video, duration: video.duration };
}

function getPoseModule() {
  poseModulePromise ||= import("./pose-engine.js?v=30");
  return poseModulePromise;
}

function getPoseLibrary() {
  poseLibraryPromise ||= fetch("assets/pose/pose-library.json?v=2", { cache: "no-store" }).then(response => {
    if (!response.ok) throw new Error("pose-library-error");
    return response.json();
  });
  return poseLibraryPromise;
}

function mapPoseMatches(result) {
  return result.matches.map(match => ({
    ...match,
    item: elements.find(item => item.id === match.id)
  })).filter(match => match.item);
}

function readCollection() {
  try {
    const parsed = JSON.parse(localStorage.getItem(collectionStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCollection(items) {
  try {
    localStorage.setItem(collectionStorageKey, JSON.stringify(items));
    return true;
  } catch {
    shotStatus.textContent = "浏览器储存空间不足，暂时无法保存这张截图。";
    shotStatus.classList.add("is-error");
    return false;
  }
}

function removeCollectionItem(id) {
  const next = readCollection().filter(item => item.id !== id);
  if (writeCollection(next)) renderCollection();
}

function renderCollection() {
  const saved = readCollection();
  savedCollection.replaceChildren();
  collectionCount.textContent = `动作库 ${saved.length}`;
  clearCollectionButton.hidden = saved.length === 0;
  if (!saved.length) {
    const empty = document.createElement("p");
    empty.className = "collection-empty";
    empty.textContent = "还没有收藏。上传一张截图开始吧。";
    savedCollection.append(empty);
    return;
  }
  saved.forEach(savedItem => {
    const item = savedItem.elementId ? elements.find(element => element.id === savedItem.elementId) : null;
    const displayName = item?.name || savedItem.customName || "待确认的新动作";
    const article = document.createElement("article");
    article.className = "saved-action";
    article.classList.toggle("is-unverified", !item);
    const screenshot = document.createElement("img");
    screenshot.src = savedItem.screenshot;
    screenshot.alt = `${displayName} 的练习截图`;
    const copy = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = displayName;
    const meta = document.createElement("span");
    meta.textContent = item
      ? `${item.category === "hand" ? "手部元素" : "脚步元素"} · ${savedItem.date}`
      : `待确认 · 来自${savedItem.sourceKind === "video" ? "视频" : "图片"} · ${savedItem.date}`;
    copy.append(name, meta);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "saved-action__remove";
    remove.setAttribute("aria-label", `移除 ${displayName}`);
    remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    remove.addEventListener("click", () => removeCollectionItem(savedItem.id));
    article.append(screenshot, copy, remove);
    savedCollection.append(article);
  });
}

function saveCandidate(item, score, button) {
  if (!currentScreenshot) return;
  const saved = readCollection();
  const entry = {
    id: `${Date.now()}-${item.id}`,
    elementId: item.id,
    screenshot: currentScreenshot,
    score,
    sourceKind: currentMediaType,
    date: new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(new Date())
  };
  if (!writeCollection([entry, ...saved])) return;
  renderCollection();
  shotResults.querySelectorAll(".shot-match__save").forEach(control => {
    control.classList.remove("is-saved");
    control.textContent = "收藏";
  });
  button.classList.add("is-saved");
  button.textContent = "已收藏";
  shotStatus.textContent = `已把 ${item.name} 收进动作库。`;
  document.querySelector("#collectionTitle").scrollIntoView({ behavior: "smooth", block: "center" });
}

function saveNewAction() {
  if (!currentScreenshot) return;
  const saved = readCollection();
  const customName = newActionName.value.trim() || "待确认的新动作";
  const entry = {
    id: `${Date.now()}-new`,
    elementId: null,
    customName,
    screenshot: currentScreenshot,
    sourceKind: currentMediaType,
    date: new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(new Date())
  };
  if (!writeCollection([entry, ...saved])) return;
  renderCollection();
  saveNewActionButton.textContent = "已作为新动作收藏";
  saveNewActionButton.classList.add("is-saved");
  shotStatus.textContent = `已把“${customName}”作为待确认的新动作收进动作库。`;
}

function renderCandidates(matches, assessment) {
  shotResults.replaceChildren();
  matchVerdict.hidden = false;
  matchVerdict.className = `match-verdict ${assessment.confident ? "is-likely" : "is-unknown"}`;
  matchVerdict.innerHTML = assessment.singleFrame
    ? "<strong>单帧姿态候选</strong><span>图片没有动作时间信息，只能比较此刻的身体姿态，不能确认连续动作。</span>"
    : assessment.confident
      ? "<strong>连续动作匹配</strong><span>已比较整段关键点轨迹；请结合节奏、方向和动作名称人工确认。</span>"
      : "<strong>可能未收录</strong><span>连续轨迹没有足够明确的库内匹配，下面 5 项只作为相近动作参考。</span>";
  matches.forEach(({ item, score }, index) => {
    const article = document.createElement("article");
    article.className = "shot-match";
    const image = document.createElement("img");
    image.src = item.poster;
    image.alt = `${item.name} 动作封面`;
    const rank = document.createElement("span");
    rank.className = "shot-match__rank";
    rank.textContent = String(index + 1).padStart(2, "0");
    const copy = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = item.name;
    const meta = document.createElement("span");
    meta.textContent = `${item.category === "hand" ? "手部元素" : "脚步元素"} · ${assessment.singleFrame ? "单帧姿态候选" : "连续轨迹候选"}`;
    copy.append(name, meta);
    const save = document.createElement("button");
    save.type = "button";
    save.className = "shot-match__save";
    save.textContent = "收藏";
    save.addEventListener("click", () => saveCandidate(item, score, save));
    article.append(image, rank, copy, save);
    shotResults.append(article);
  });
  newActionPanel.hidden = false;
  newActionName.value = "";
  saveNewActionButton.textContent = "作为新动作收藏";
  saveNewActionButton.classList.remove("is-saved");
}

async function processMediaFile(file, source = "upload") {
  const isImage = file?.type.startsWith("image/");
  const isVideo = file?.type.startsWith("video/");
  if (!isImage && !isVideo) {
    shotStatus.textContent = "请选择图片或视频文件。";
    shotStatus.classList.add("is-error");
    return;
  }
  if (currentVideoUrl) {
    URL.revokeObjectURL(currentVideoUrl);
    currentVideoUrl = "";
  }
  shotStatus.classList.remove("is-error");
  shotStatus.textContent = isVideo ? "正在加载人体姿态模型，并读取连续动作…" : "正在提取单帧人体关键点…";
  shotDropzone.classList.add("is-loading");
  shotPick.disabled = true;
  poseOverlay.hidden = true;
  matchVerdict.hidden = true;
  newActionPanel.hidden = true;
  try {
    currentMediaType = isVideo ? "video" : "image";
    const [pose, library] = await Promise.all([getPoseModule(), getPoseLibrary()]);
    let querySequence;
    let landmarkPreview;
    let previewMedia;
    let comparison;
    let analyzedWindows = 1;
    if (isVideo) {
      const prepared = await prepareVideo(file);
      currentVideoUrl = prepared.source;
      shotVideoPreview.src = currentVideoUrl;
      shotVideoPreview.hidden = false;
      shotPreview.hidden = true;
      const windowDuration = prepared.duration > 12 ? Math.min(5.2, prepared.duration) : prepared.duration;
      analyzedWindows = prepared.duration > 12 ? Math.min(5, Math.ceil(prepared.duration / windowDuration)) : 1;
      const starts = analyzedWindows === 1
        ? [0]
        : Array.from({ length: analyzedWindows }, (_, index) =>
            (prepared.duration - windowDuration) * index / (analyzedWindows - 1));
      let bestWindow = null;
      for (let windowIndex = 0; windowIndex < starts.length; windowIndex++) {
        const extracted = await pose.extractVideoPoseSequence(prepared.video, {
          start: starts[windowIndex],
          duration: windowDuration,
          sampleCount: 18,
          seek: seekVideo,
          onProgress: (done, total, detected) => {
            const windowLabel = starts.length > 1 ? `片段 ${windowIndex + 1}/${starts.length} · ` : "";
            shotStatus.textContent = `正在提取连续人体关键点 · ${windowLabel}${done}/${total} · 已识别 ${detected} 帧…`;
          }
        });
        if (extracted.sequence.length < Math.min(8, Math.ceil(extracted.requestedFrames * .5))) continue;
        const candidateComparison = pose.comparePoseQuery(extracted.sequence, library);
        if (!bestWindow || candidateComparison.assessment.top < bestWindow.comparison.assessment.top) {
          bestWindow = { extracted, comparison: candidateComparison };
        }
      }
      if (!bestWindow) throw new Error("pose-not-found");
      querySequence = bestWindow.extracted.sequence;
      comparison = bestWindow.comparison;
      const centerCapture = bestWindow.extracted.captures[Math.floor(bestWindow.extracted.captures.length / 2)];
      if (centerCapture) {
        await seekVideo(prepared.video, centerCapture.time);
        currentScreenshot = videoFrameDataUrl(prepared.video);
        if (shotVideoPreview.readyState < 1) await waitForMedia(shotVideoPreview, "loadedmetadata").catch(() => {});
        await seekVideo(shotVideoPreview, centerCapture.time).catch(() => {});
        landmarkPreview = centerCapture.landmarks;
      }
      previewMedia = shotVideoPreview;
    } else {
      currentScreenshot = await prepareScreenshot(file);
      shotPreview.src = currentScreenshot;
      if (!shotPreview.complete) await waitForMedia(shotPreview, "load");
      shotPreview.hidden = false;
      shotVideoPreview.pause();
      shotVideoPreview.removeAttribute("src");
      shotVideoPreview.hidden = true;
      const image = await loadImage(currentScreenshot);
      const extracted = await pose.extractImagePose(image);
      if (!extracted.frame) throw new Error("pose-not-found");
      querySequence = [extracted.frame];
      landmarkPreview = extracted.landmarks;
      previewMedia = shotPreview;
    }
    shotPreviewEmpty.hidden = true;
    pose.drawPose(poseOverlay, landmarkPreview, previewMedia);
    comparison ||= pose.comparePoseQuery(querySequence, library, { singleFrame: isImage });
    renderCandidates(mapPoseMatches(comparison), comparison.assessment);
    const action = source === "paste" ? "粘贴内容" : isVideo ? "视频" : "图片";
    shotStatus.textContent = isVideo
      ? `${action}处理完成：已按时间顺序比较连续人体关键点${analyzedWindows > 1 ? `，并检查 ${analyzedWindows} 个连续片段` : ""}。候选只来自网站现有 87 个动作。`
      : `${action}处理完成：这是单帧姿态候选；要识别动作，请上传 2–8 秒视频。`;
  } catch (error) {
    poseOverlay.hidden = true;
    shotStatus.textContent = error?.message === "pose-not-found"
      ? "没有检测到足够完整、连续的人体关键点。请让全身进入画面，并上传 2–12 秒的单个动作视频。"
      : "这个文件暂时无法读取或姿态模型未能启动，请换一个浏览器支持的视频再试。";
    shotStatus.classList.add("is-error");
  } finally {
    shotDropzone.classList.remove("is-loading");
    shotPick.disabled = false;
    shotInput.value = "";
  }
}

shotPick.addEventListener("click", () => shotInput.click());
shotDropzone.addEventListener("click", event => {
  if (event.target.closest("video")) return;
  shotInput.click();
});
shotDropzone.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    shotInput.click();
  }
});
shotInput.addEventListener("change", () => processMediaFile(shotInput.files[0]));
shotVideoPreview.addEventListener("play", () => { poseOverlay.hidden = true; });
["dragenter", "dragover"].forEach(type => shotDropzone.addEventListener(type, event => {
  event.preventDefault();
  shotDropzone.classList.add("is-dragging");
}));
["dragleave", "drop"].forEach(type => shotDropzone.addEventListener(type, event => {
  event.preventDefault();
  shotDropzone.classList.remove("is-dragging");
}));
shotDropzone.addEventListener("drop", event => processMediaFile([...event.dataTransfer.files].find(file => /^(image|video)\//.test(file.type))));
document.addEventListener("paste", event => {
  if (event.defaultPrevented) return;
  const clipboardFiles = [...(event.clipboardData?.files || [])];
  let file = clipboardFiles.find(item => /^(image|video)\//.test(item.type));
  if (!file) {
    const clipboardItem = [...(event.clipboardData?.items || [])].find(item => /^(image|video)\//.test(item.type));
    file = clipboardItem?.getAsFile();
  }
  if (!file) return;
  event.preventDefault();
  shotDropzone.classList.add("is-pasted");
  setTimeout(() => shotDropzone.classList.remove("is-pasted"), 650);
  processMediaFile(file, "paste");
});
saveNewActionButton.addEventListener("click", saveNewAction);
clearCollectionButton.addEventListener("click", () => {
  if (!window.confirm("确定要清空动作库吗？")) return;
  localStorage.removeItem(collectionStorageKey);
  renderCollection();
  shotStatus.textContent = "动作库已清空。";
});

renderCollection();
startElementCompanions();

const sidebarToggle = document.querySelector("#sidebarToggle");
const appSidebar = document.querySelector("#appSidebar");
const sidebarBackdrop = document.querySelector("#sidebarBackdrop");
const sidebarLinks = [...document.querySelectorAll(".sidebar-link")];

function setSidebarOpen(open) {
  document.body.classList.toggle("is-sidebar-open", open);
  sidebarToggle.setAttribute("aria-expanded", String(open));
  sidebarToggle.setAttribute("aria-label", open ? "关闭功能导航" : "打开功能导航");
  sidebarBackdrop.hidden = !open;
}

sidebarToggle.addEventListener("click", () => setSidebarOpen(!document.body.classList.contains("is-sidebar-open")));
sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));
sidebarLinks.forEach(link => link.addEventListener("click", () => {
  sidebarLinks.forEach(item => item.classList.toggle("is-active", item === link));
  setSidebarOpen(false);
}));

const observedSections = sidebarLinks.map(link => document.querySelector(`#${link.dataset.section}`)).filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  sidebarLinks.forEach(link => link.classList.toggle("is-active", link.dataset.section === visible.target.id));
}, { rootMargin: "-18% 0px -62% 0px", threshold: [0, .1, .35] });
observedSections.forEach(section => sectionObserver.observe(section));

window.addEventListener("keydown", event => {
  if (event.key === "Escape" && document.body.classList.contains("is-sidebar-open")) setSidebarOpen(false);
});

