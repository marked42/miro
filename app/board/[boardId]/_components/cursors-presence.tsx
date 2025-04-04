import { useOthersConnectionIds } from "@liveblocks/react"
import { memo } from "react"
import { Cursor } from "./cursor";


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

export const CursorsPresence = memo(() => {
  return (
    <>
      <Cursors />
    </>
  )
})

CursorsPresence.displayName = 'CursorsPresence'
