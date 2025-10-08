'use client'

import Image from 'next/image'
import React from 'react'

interface Position {
  row: number
  col: number
}

interface PieceProps {
  type: 'pawn' | 'king'
  color: 'white' | 'black'
  position: Position
  isSelected?: boolean
  onClick?: () => void
  onDragStart?: () => void
}

export default function Piece({ 
  type, 
  color, 
  isSelected = false, 
  onClick, 
  onDragStart 
}: PieceProps) {
  const handleDragStart = () => {
    onDragStart?.()
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.()
  }

  const pieceSize = 56;

  return (
    <div 
      className={`text-sm text-black font-semibold cursor-grab text-xl w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        isSelected ? 'ring-2 ring-blue-400 scale-110' : ''
      }`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      {type === 'pawn' ? 
        (color === 'white' ? 
          <Image src="/pieces/white-pawn.png" alt="White Pawn" width={pieceSize} height={pieceSize} /> 
        : 
          <Image src="/pieces/black-pawn.png" alt="Black Pawn" width={pieceSize} height={pieceSize} />) 
        : type === 'king' ?
        (color === 'white' ? 
          <Image src="/pieces/white-king.png" alt="White King" width={pieceSize} height={pieceSize} /> 
        : 
          <Image src="/pieces/black-king.png" alt="Black King" width={pieceSize} height={pieceSize} />)
        : ''
      }
    </div>
  )
}
