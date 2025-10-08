'use client'

import React, { useState } from 'react'
import Board from '../Board'
import { usePieceRules } from '../../hooks/usePieceRules'

interface Position {
  row: number
  col: number
}

interface PieceData {
  type: 'pawn' | 'king'
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
    { type: 'king', color: 'black', position: { row: 0, col: 4 } },
    { type: 'king', color: 'white', position: { row: 7, col: 3 } },
  ])

  // Add turn state
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white')
  
  const { selectedPiece, validMoves, selectPiece, clearSelection, isValidMove } = usePieceRules()

  const handlePieceClick = (piece: PieceData) => {
    // Only allow selecting pieces of the current turn's color
    if (piece.color !== currentTurn) {
      return // Ignore clicks on opponent's pieces
    }
    
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
      // Switch turns after a successful move
      setCurrentTurn(currentTurn === 'white' ? 'black' : 'white')
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
    // Only allow dragging pieces of the current turn's color
    if (piece.color !== currentTurn) {
      return
    }
    selectPiece(piece, pieces)
  }

  const handleDrop = (row: number, col: number) => {
    if (selectedPiece && isValidMove({ row, col })) {
      movePiece(selectedPiece.position, { row, col })
      // Switch turns after a successful move
      setCurrentTurn(currentTurn === 'white' ? 'black' : 'white')
    }
    clearSelection()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Chess Game</h1>
      
      {/* Add turn indicator */}
      <div className="text-lg font-semibold">
        Current Turn: <span className={currentTurn === 'white' ? 'text-blue-600' : 'text-red-600'}>
          {currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}
        </span>
      </div>
      
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