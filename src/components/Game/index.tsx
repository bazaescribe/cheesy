'use client'

import React, { useState } from 'react'
import Board from '../Board'
import { usePieceRules } from '../../hooks/usePieceRules'

interface Position {
  row: number
  col: number
}

interface PieceData {
  type: 'pawn'
  color: 'white' | 'black'
  position: Position
}

export default function Game() {
  const [pieces, setPieces] = useState<PieceData[]>([
    { type: 'pawn', color: 'white', position: { row: 6, col: 0 } },
    { type: 'pawn', color: 'white', position: { row: 6, col: 1 } },
    { type: 'pawn', color: 'white', position: { row: 6, col: 2 } },
    { type: 'pawn', color: 'white', position: { row: 6, col: 3 } },
    { type: 'pawn', color: 'white', position: { row: 6, col: 4 } },
    { type: 'pawn', color: 'white', position: { row: 6, col: 5 } },
    { type: 'pawn', color: 'white', position: { row: 6, col: 6 } },
    { type: 'pawn', color: 'white', position: { row: 6, col: 7 } },
    { type: 'pawn', color: 'black', position: { row: 1, col: 0 } },
    { type: 'pawn', color: 'black', position: { row: 1, col: 1 } },
    { type: 'pawn', color: 'black', position: { row: 1, col: 2 } },
    { type: 'pawn', color: 'black', position: { row: 1, col: 3 } },
    { type: 'pawn', color: 'black', position: { row: 1, col: 4 } },
    { type: 'pawn', color: 'black', position: { row: 1, col: 5 } },
    { type: 'pawn', color: 'black', position: { row: 1, col: 6 } },
    { type: 'pawn', color: 'black', position: { row: 1, col: 7 } },
  ])

  const { selectedPiece, validMoves, selectPiece, clearSelection, isValidMove } = usePieceRules()

  const handlePieceClick = (piece: PieceData) => {
    if (
      selectedPiece &&
      selectedPiece.position.row === piece.position.row &&
      selectedPiece.position.col === piece.position.col
    ) {
      clearSelection()
    } else {
      selectPiece(piece, pieces)
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (selectedPiece && isValidMove({ row, col })) {
      movePiece(selectedPiece.position, { row, col })
      clearSelection()
    }
  }

  const movePiece = (fromPosition: Position, toPosition: Position) => {
    setPieces(prevPieces => {
      // Remove any piece at the destination (capture)
      const piecesWithoutDestination = prevPieces.filter(
        piece => !(piece.position.row === toPosition.row && piece.position.col === toPosition.col)
      )
      
      // Move the selected piece
      return piecesWithoutDestination.map(piece => 
        piece.position.row === fromPosition.row && piece.position.col === fromPosition.col
          ? { ...piece, position: toPosition }
          : piece
      )
    })
  }

  const handleDragStart = (piece: PieceData) => {
    selectPiece(piece, pieces)
  }

  const handleDrop = (row: number, col: number) => {
    if (selectedPiece && isValidMove({ row, col })) {
      movePiece(selectedPiece.position, { row, col })
    }
    clearSelection()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Chess Game</h1>
      <Board 
        pieces={pieces}
        selectedPiece={selectedPiece}
        validMoves={validMoves}
        onPieceClick={handlePieceClick}
        onCellClick={handleCellClick}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      />
      <div className="text-sm text-gray-600">
        Pieces on board: {pieces.length}
        {selectedPiece && (
          <div className="mt-2">
            Selected: {selectedPiece.color} {selectedPiece.type} at ({selectedPiece.position.row}, {selectedPiece.position.col})
            <br />
            Valid moves: {validMoves.length}
          </div>
        )}
      </div>
    </div>
  )
}