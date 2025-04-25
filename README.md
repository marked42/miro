# Miro

## 功能

主要功能：

- 🛠️ 白板从头开始
- 🧰 带有文本、形状、便笺和铅笔的工具栏
- 🪄 分层功能
- 🎨 着色系统
- ↩️ 撤消和恢复功能
- ⌨️ 键盘快捷键
- 🤝 实时协作
- 💾 实时数据库
- 🔐 授权、组织和邀请
- ⭐️ 有利的功能
- 🌐 Next.js 14 框架
- 💅 TailwindCSS & ShadcnUI 造型

## 开发

本地配置文件`.env.local`

```env
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=dev:wary-lemming-644 # team: mark-zhang, project: miro-b762d

NEXT_PUBLIC_CONVEX_URL=https://wary-lemming-644.convex.cloud

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXhwZXJ0LWFyYWNobmlkLTcxLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_p3uovcEWZDYAW8cLhNHA5j4ocnxhUppFvRYDVUbxlV

LIVEBLOCKS_SECRET_KEY=sk_dev_m-Q8VuwytUS3WIgZBi-SYy474OMLyln5MnzPaWwIMnm7NVWVj743b-t89IWURHOn
```

## Getting Started

First, run the development server:

```bash
# 启动页面服务器
pnpm run dev

# 启动后端服务
pnpm run server
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

1. use [Clerk](https://dashboard.clerk.com/apps/app_2uz7PdaeImwSRqMwQ1Y7ESBaHet/instances/ins_2uz7PYeyCkToGEHShrfHBpR5ZCV/jwt-templates/jtmp_2uz8pRUjYaBj3U2yyY5KJ3bsech) for Authentication
1. use [convex](https://dashboard.convex.dev/t/mark-zhang) as backend service, refer to [doc] authentication with clerk.
1. use liveblocks 协同编辑功能

## 部署

## TODO:

1. 客户端组件静态属性问题，nextjs 如何支持 SSR

```tsx
'use client'

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 w-12 flex items-center shadow-md"></div>
  )
}
```

1. ModalProvider Pattern, root ModalProvider/useRenameModal hook, 全局只有一个 modal 实例
1. ClientSideSuspense 依赖反转设计

```tsx
<LiveblocksProvider authEndpoint="/api/liveblocks-auth">
  <RoomProvider id={roomId}>
    <ClientSideSuspense fallback={fallback}>{children}</ClientSideSuspense>
  </RoomProvider>
</LiveblocksProvider>
```

1. 下面代码 foreignObject 的 transform 变话在 safari 上不会触发更新， 在 Safari 中实现可靠的 foreignObject 动态变换，最佳实践是： 始终用 `<g>` 包裹 foreignObject, 将 transform 移至 `<g>` 标签, 必要时添加 will-change: transform 提示浏览器优化；或者使用 DOM 元素。 safari 上 svg 元素的大小 class 设置不生效，需要使用 width/height 强制全屏。

```html
<svg class="h-[100vh] w-[100vw]" width="100%" height="100%">
  <g>
    <foreignObject style="transform: translateX(100px)"></foreignObject>
  </g>
</svg>
```

1. safari 浏览器 onPointerLeave 事件不触发的兼容问题
1. only one user selection is showed for single layer, consider displaying all user selection
