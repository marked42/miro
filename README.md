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
