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
- 网站实际展示所需的元素短片、海报与本地姿态模型保留在仓库中。
- 开始修改前先阅读 `outputs/下一步优化方向.md`，避免遗漏已记录的产品判断。


