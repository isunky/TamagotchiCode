# 拓麻歌子 Paradise · 中文代码图鉴

Tamagotchi Paradise 中文兑换码速查网页。基于原中文整理版做小幅优化，保留 78 条记录、77 张原站图片，以及粉紫色图鉴布局。

- 按类别和主机版本筛选，支持中文、英文、代码与来源搜索。
- 一键复制，保留代码前导零；图鉴与表格视图切换。
- 已使用标记、主机版本与视图偏好保存在当前浏览器。
- 图片全部随仓库保存，页面加载不依赖 Fandom 图片服务器。
- 图片可放大，支持键盘打开、Esc 关闭及焦点恢复，适配窄屏与减少动态效果设置。
- 无第三方运行依赖、无需打包构建，可以直接部署静态文件。

## 本地查看

可以直接打开 `public/index.html`；本地文件下的剪贴板和存储能力取决于浏览器限制，建议使用 HTTP 预览：

```sh
python -m http.server 8080 --directory public
```

打开 <http://localhost:8080>。线上 HTTPS 部署支持浏览器剪贴板 API。

## 部署到 Cloudflare Pages

推荐连接 GitHub，推送 `main` 后自动部署。在 Cloudflare 控制台进入 **Workers & Pages → Create application → Pages → Import an existing Git repository**，选择 `isunky/TamagotchiCode`，填写：

| 设置 | 值 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `public` |
| Root directory | 仓库根目录（留空） |

保存并部署后，Cloudflare 会分配实际的 `*.pages.dev` 地址。首次连接需要在 Cloudflare 中授权该 GitHub 仓库；本仓库不包含令牌或账户凭证。

也可以在安装 Node.js 后通过 Wrangler 直接上传：

```sh
npx wrangler login
npx wrangler pages project create tamagotchi-code --production-branch main
npx wrangler pages deploy public --project-name tamagotchi-code --branch main
```

已有同名项目时跳过创建命令。Git 集成与 Direct Upload 是两种不同的项目创建方式，建议先选定一种；`wrangler.jsonc` 已声明 Pages 输出目录为 `public`。

配置依据：[Cloudflare 静态 HTML 部署指南](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)、[Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)。

## 维护与检查

```sh
node --check public/assets/app.js
node --check public/assets/data.js
node scripts/validate.mjs
```

GitHub Actions 会在 `main` 推送和 PR 时执行相同检查，核对数据格式、本地图片、来源记录与 SHA-256。不需要安装 npm 包。

- `public/index.html`：页面结构。
- `public/assets/styles.css`：样式与响应式布局。
- `public/assets/data.js`：中文数据；`img` 保留原站文件名，`localImg` 指向本地图片。
- `public/assets/app.js`：搜索、筛选、复制、本地标记及放大交互。
- `public/assets/images/`：77 张图片（原站 CDN 返回的 WebP 格式）。
- `public/assets/image-sources.json`：逐张来源与完整性信息。
- `public/_headers`：Cloudflare Pages 响应头与图片缓存。

原整理中的“秋千 / Swing”没有图片，页面明确显示未提供图片。兑换码和版本对应关系保留自原整理，并非自动同步的数据；后续可直接编辑 `data.js`。同一码在不同版本对应不同外观的记录会分别保留。

## 资料与许可

资料来自 [Tamagotchi Wiki / Fandom](https://tamagotchi.fandom.com/wiki/Tamagotchi_Paradise/List_of_Codes)，本项目为非官方中文整理。仓库原有 Apache-2.0 LICENSE 用于代码；Wiki 翻译内容、商标与图片遵循各自授权，详见 [NOTICE.md](NOTICE.md)。
