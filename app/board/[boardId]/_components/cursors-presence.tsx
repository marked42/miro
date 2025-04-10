import { shallow, useOthersConnectionIds, useOthersMapped } from "@liveblocks/react"
import { memo } from "react"
import { Cursor } from "./cursor";
import { Path } from "./path";
import { colorToCss } from "@/lib/utils";


export const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map(id => {
        return (
          <Cursor
            key={id}
            connectionId={id}
          />
        )
      })}
    </>
  )
}

/**
 * display other users' pencil path in realtime
 */
const Drafts = () => {
  const others = useOthersMapped(other => ({
    pencilDraft: other.presence.pencilDraft,
    penColor: other.presence.penColor,
  }), shallow)

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss(other.penColor) : '#000'}
            />
          )
        }
      })}
    </>
  )
}

export const CursorsPresence = memo(() => {
  return (
    <>
      <Drafts />
      <Cursors />
    </>
  )
})

CursorsPresence.displayName = 'CursorsPresence'
