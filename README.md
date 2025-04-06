# Miro Clone

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

1. use [Clerk](https://dashboard.clerk.com/apps/app_2uz7PdaeImwSRqMwQ1Y7ESBaHet/instances/ins_2uz7PYeyCkToGEHShrfHBpR5ZCV/jwt-templates/jtmp_2uz8pRUjYaBj3U2yyY5KJ3bsech) for Authentication
1. use [convex](https://dashboard.convex.dev/t/mark-zhang) as backend service, refer to [doc] authentication with clerk.

## TODO:

1. button inside link `<a>`, click button triggers opening url
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
