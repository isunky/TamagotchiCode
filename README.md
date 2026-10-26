<div align="center">

# 🐣 Tamagotchi Paradise 中文代码图鉴

查兑换码、看适用版本、复制即用。

[![构建状态](https://img.shields.io/github/actions/workflow/status/isunky/TamagotchiCode/check.yml?branch=main&label=build&logo=githubactions&logoColor=white)](https://github.com/isunky/TamagotchiCode/actions/workflows/check.yml)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-在线-F38020?logo=cloudflare&logoColor=white)](https://tamagotchi-code.pages.dev)
[![静态网站](https://img.shields.io/badge/依赖-零-blue)](https://github.com/isunky/TamagotchiCode)

[打开在线图鉴](https://tamagotchi-code.pages.dev) · [浏览 GitHub 仓库](https://github.com/isunky/TamagotchiCode) · [查看英文资料](https://tamagotchi.fandom.com/wiki/Tamagotchi_Paradise/List_of_Codes)

</div>

## 关于本项目

一个轻巧的中文速查页，整理 Tamagotchi Paradise 的角色贴纸码与商店兑换码。共收录 **78 条记录**，其中 **77 张图片已随项目保存**；打开图鉴后，不必再从原站加载图片。

## 图鉴功能

- **快速查找：** 搜索中文名、英文名、兑换码或获取途径。
- **按需筛选：** 按类别和主机版本查找适用代码。
- **一键复制：** 保留代码中的空格和前导零。
- **两种视图：** 在图片卡片与紧凑表格间切换。
- **个人标记：** 记下已使用的代码；标记和筛选偏好保存在当前浏览器。
- **原图放大：** 点击图片查看细节，也支持键盘操作。

## 在线使用

直接打开 **[tamagotchi-code.pages.dev](https://tamagotchi-code.pages.dev)** 即可。无需安装或注册；GitHub 上的 `main` 分支更新后，Cloudflare Pages 会自动重新部署。

## 在本地运行

项目是纯静态网页，无需 npm 安装、打包或构建。用 Python 启动本地预览：

```bash
python -m http.server 8080 --directory public
```

浏览器访问 [http://localhost:8080](http://localhost:8080)。也可以直接打开 `public/index.html`；部分浏览器在直接打开文件时会限制剪贴板或本地存储功能。

## Cloudflare Pages 部署

本仓库已连接至 Cloudflare Pages 项目 **`tamagotchi-code`**。自动部署设置如下：

| 项目 | 设置 |
| --- | --- |
| GitHub 仓库 | [`isunky/TamagotchiCode`](https://github.com/isunky/TamagotchiCode) |
| 生产分支 | `main` |
| 框架预设 | `None` |
| 构建命令 | `exit 0` |
| 输出目录 | `public` |
| 根目录 | `/`（仓库根目录） |
| 正式网址 | [tamagotchi-code.pages.dev](https://tamagotchi-code.pages.dev) |

其他分支会生成预览部署。检查或修改设置时，在 Cloudflare 控制台打开 **Workers & Pages → tamagotchi-code → Settings → Builds & deployments**。

## 项目结构

```text
public/
├── index.html                 页面结构
├── _headers                   响应头与图片缓存
└── assets/
    ├── app.js                 搜索、筛选、复制与界面交互
    ├── data.js                代码、分类与来源说明
    ├── styles.css             页面样式与窄屏布局
    ├── image-sources.json     图片来源与 SHA-256 校验值
    └── images/                本地 WebP 图片
scripts/
└── validate.mjs               校验数据、图片与文件引用
```

编辑图鉴数据时，更新 `public/assets/data.js` 中对应记录，并保留 `localImg` 路径和 `public/assets/image-sources.json` 中的图片来源记录。

## 资料与版权

代码与中文整理依据 [Tamagotchi Wiki 的代码列表](https://tamagotchi.fandom.com/wiki/Tamagotchi_Paradise/List_of_Codes)。本项目为非官方中文整理，代码适用性请以实际设备为准。

仓库中的 `LICENSE` 适用于项目代码。Wiki 文字、翻译内容、拓麻歌子商标和图片分别遵循其原有权利与授权；图片来源及相关说明见 [`NOTICE.md`](NOTICE.md) 和 `public/assets/image-sources.json`。
