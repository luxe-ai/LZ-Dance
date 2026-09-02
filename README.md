# ChatCut Dance Project

恢复并持续迭代中的私人练舞产品原型，当前包含练习记录、课堂视频分析、人物确认、ChatCut 课堂片段、元素集合与待练清单等功能。

## 项目位置

- 网站：`outputs/elements-site/`
- 下一步优化方向：`outputs/下一步优化方向.md`
- Supabase：`supabase/`
- Cloudflare Worker：`cloudflare/`

## 本地运行

```powershell
cd outputs/elements-site
node server.mjs
```

然后打开终端显示的本地地址；当前开发环境通常使用 `http://127.0.0.1:4174/`。

## 协作说明

- 不要提交 `.env`、`.dev.vars`、私钥、本地数据库或用户上传的视频。
- `outputs/elements-site/assets/source.mp4` 和 `assets/master/` 是本地保留的原始大视频，不进入 GitHub。
- 当前 GitHub 协作分支先同步源码、配置与文档；元素短片、海报、本地姿态模型等二进制素材仍保留在本地恢复目录，暂未上传。
- 开始修改前先阅读 `outputs/下一步优化方向.md`，避免遗漏已记录的产品判断。

## 多 AI 协作方式

- `main` 是当前协作基线，其他 AI 默认从这里开始，不需要切换分支。
- `codex-restore` 是恢复上传时使用的暂存分支，内容已合并到 `main`；它保留作恢复过程记录。
- 每个 AI 开始一个独立分支，例如 `ai/class-video-analysis` 或 `ai/practice-editing`，不要多人同时直接修改同一个分支。
- 完成后提交自己的分支，再通过 Pull Request 合并回 `main`；合并前先同步最新的 `main`，减少冲突。
- 如果只是查看或让另一个 AI 阅读项目，直接打开仓库的 `main` 即可。

