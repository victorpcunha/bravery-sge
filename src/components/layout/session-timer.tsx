'use client'

import { useEffect, useState } from 'react'

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`
}

export function SessionTimer() {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="text-[13px] text-muted-foreground tabular-nums">
      Sessão: {formatTimer(elapsed)}
    </span>
  )
}
