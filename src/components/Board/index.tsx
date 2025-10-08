'use client'

import React from 'react'
import Piece from '../Piece'

interface Position {
  row: number
  col: number
}

interface PieceData {
  type: 'pawn' | 'king'
  color: 'white' | 'black'
  position: Position
}

interface BoardProps {
  pieces?: PieceData[]
  selectedPiece?: PieceData | null
  validMoves?: Position[]
  onPieceClick?: (piece: PieceData) => void
  onCellClick?: (row: number, col: number) => void
  onDragStart?: (piece: PieceData) => void
  onDrop?: (row: number, col: number) => void
}

export default function Board({ 
  pieces = [], 
  selectedPiece, 
  validMoves = [], 
  onPieceClick, 
  onCellClick,
  onDragStart,
  onDrop
}: BoardProps) {
  const rows = 8
  const columns = 8

  // Helper function to find piece at specific position
  const getPieceAtPosition = (row: number, col: number) => {
    return pieces.find(piece => piece.position.row === row && piece.position.col === col)
  }

  const isValidMove = (row: number, col: number) => {
    return validMoves.some(move => move.row === row && move.col === col)
  }

  const isSelected = (piece: PieceData) => {
    return !!(selectedPiece && 
           selectedPiece.position.row === piece.position.row && 
           selectedPiece.position.col === piece.position.col)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault()
    onDrop?.(row, col)
  }

  return (
    <div className="bg-white/20">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: columns }, (_, cellIndex) => {
            const isDark = (rowIndex + cellIndex) % 2 === 1
            const tileImage = isDark ? '/tiles/black.png' : '/tiles/white.png'
            const pieceAtPosition = getPieceAtPosition(rowIndex, cellIndex)
            const isValidMoveCell = isValidMove(rowIndex, cellIndex)
            const isSelectedCell = pieceAtPosition ? isSelected(pieceAtPosition) : false

            return (
              <div
                key={cellIndex}
                className={`w-16 h-16 flex items-center justify-center relative ${
                  isValidMoveCell ? 'ring-2 ring-green-400' : ''
                } ${
                  isSelectedCell ? 'ring-2 ring-blue-400' : ''
                }`}
                style={{
                  backgroundImage: `url('${tileImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
                onClick={() => onCellClick?.(rowIndex, cellIndex)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex, cellIndex)}
              >
                {pieceAtPosition && (
                  <Piece 
                    type={pieceAtPosition.type} 
                    color={pieceAtPosition.color} 
                    position={pieceAtPosition.position}
                    isSelected={isSelectedCell}
                    onClick={() => onPieceClick?.(pieceAtPosition)}
                    onDragStart={() => onDragStart?.(pieceAtPosition)}
                  />
                )}
                {isValidMoveCell && !pieceAtPosition && (
                  <div className="w-4 h-4 bg-green-400 rounded-full opacity-60" />
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
