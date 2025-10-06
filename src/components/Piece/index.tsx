'use client'

import Image from 'next/image'
import React from 'react'

interface Position {
  row: number
  col: number
}

interface PieceProps {
  type: 'pawn'
  color: 'white' | 'black'
  position: Position
  isSelected?: boolean
  onClick?: () => void
  onDragStart?: () => void
}

export default function Piece({ 
  type, 
  color, 
  position, 
  isSelected = false, 
  onClick, 
  onDragStart 
}: PieceProps) {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart?.()
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.()
  }

  return (
    <div 
      className={`text-sm text-black font-semibold cursor-grab text-xl w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        isSelected ? 'ring-2 ring-blue-400 scale-110' : ''
      }`}
      // style={{
      //   background: color === 'white' ? 'white' : 'black',
      // }}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      {type === 'pawn' ? 
        (color === 'white' ? 
          <Image src="/pieces/white-pawn.png" alt="White Pawn" width={40} height={40} /> 
        : 
          <Image src="/pieces/black-pawn.png" alt="Black Pawn" width={40} height={40} />) 
        : ''
      }
    </div>
  )
}
