import { api } from '@/convex/_generated/api'
import { auth } from '@clerk/nextjs/server'
import { Liveblocks } from '@liveblocks/node'
import { ConvexHttpClient } from 'convex/browser'
import { NextResponse } from 'next/server'

const liveblocks = new Liveblocks({
  secret:
    'sk_dev_m-Q8VuwytUS3WIgZBi-SYy474OMLyln5MnzPaWwIMnm7NVWVj743b-t89IWURHOn',
})

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: Request) {
  const user = await auth()

  if (!user) {
    return new Response('Unauthorized', { status: 403 })
  }

  console.log('user: ', JSON.stringify(user, null, 4))
  const { room } = await request.json()
  if (!room) {
    return NextResponse.json({ error: 'Room is required' }, { status: 400 })
  }
  const board = await convex.query(api.board.get, { id: room })
  if (board?.orgId !== user.orgId) {
    return new Response('Unauthorized', { status: 403 })
  }

  // TODO: missing
  const userInfo = {
    name: user?.firstName || 'teammate',
    picture: user?.imageUrl,
  }

  const session = liveblocks.prepareSession(user.userId, { userInfo })

  if (room) {
    session.allow(room, session.FULL_ACCESS)
  }

  const { status, body } = await session.authorize()
  return new Response(body, { status })
}
