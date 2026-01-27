import React from 'react'

const FACES = {
  4: {
    outline: '50 6, 94 92, 6 92',
    left: '50 6, 6 92, 50 92',
    right: '50 6, 94 92, 50 92',
    top: '50 6, 50 50, 6 92'
  },
  6: {
    outline: '50 6, 90 28, 90 72, 50 94, 10 72, 10 28',
    left: '50 6, 10 28, 10 72, 50 94, 50 55',
    right: '50 6, 90 28, 90 72, 50 94, 50 55',
    top: '50 6, 90 28, 50 55, 10 28'
  },
  8: {
    outline: '50 4, 92 50, 50 96, 8 50',
    left: '50 4, 8 50, 50 96, 50 50',
    right: '50 4, 92 50, 50 96, 50 50',
    top: '50 4, 92 50, 50 50, 8 50'
  },
  10: {
    outline: '50 4, 84 20, 96 50, 84 80, 50 96, 16 80, 4 50, 16 20',
    left: '50 4, 16 20, 4 50, 16 80, 50 96, 50 52',
    right: '50 4, 84 20, 96 50, 84 80, 50 96, 50 52',
    top: '50 4, 84 20, 50 52, 16 20'
  },
  12: {
    outline: '50 4, 86 24, 96 58, 70 92, 30 92, 4 58, 14 24',
    left: '50 4, 14 24, 4 58, 30 92, 50 92, 50 54',
    right: '50 4, 86 24, 96 58, 70 92, 50 92, 50 54',
    top: '50 4, 86 24, 50 54, 14 24'
  },
  20: {
    outline: '50 3, 72 10, 90 26, 97 50, 90 74, 72 90, 50 97, 28 90, 10 74, 3 50, 10 26, 28 10',
    left: '50 3, 28 10, 10 26, 3 50, 10 74, 28 90, 50 97, 50 55',
    right: '50 3, 72 10, 90 26, 97 50, 90 74, 72 90, 50 97, 50 55',
    top: '50 3, 72 10, 50 55, 28 10'
  }
}

export default function DieIcon({sides, className}){
  const face = FACES[sides] || FACES[6]
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {/* faces use currentColor so CSS can set the SVG color and icons inherit it */}
      <polygon className="die-face-top" points={face.top} fill="currentColor" />
      <polygon className="die-face-left" points={face.left} fill="currentColor" />
      <polygon className="die-face-right" points={face.right} fill="currentColor" />
      {/* outline uses stroke=currentColor so it also follows color cascade */}
      <polygon className="die-outline" points={face.outline} fill="none" stroke="currentColor" />
    </svg>
  )
}
