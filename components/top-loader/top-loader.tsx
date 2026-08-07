'use client'

import NextTopLoader from 'nextjs-toploader'

const TOP_LOADER_COLOR = '#aaff00'

export default function TopLoader() {
  return (
    <NextTopLoader
      color={TOP_LOADER_COLOR}
      height={3}
      showSpinner={false}
      shadow={`0 0 10px ${TOP_LOADER_COLOR},0 0 5px ${TOP_LOADER_COLOR}`}
      zIndex={1600}
    />
  )
}
