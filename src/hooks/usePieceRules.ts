import { useState, useCallback } from 'react'

interface Position {
  row: number
  col: number
}

interface PieceData {
  type: 'pawn' | 'king'
  color: 'white' | 'black'
  position: Position
}

interface PieceRule {
  type: 'pawn' | 'king'
  getValidMoves: (piece: PieceData, allPieces: PieceData[]) => Position[]
}

const pieceRules: PieceRule[] = [
  {
    type: 'pawn',
    getValidMoves: (piece: PieceData, allPieces: PieceData[]) => {
      const { position, color } = piece
      const direction = color === 'white' ? -1 : 1
      const startRow = color === 'white' ? 6 : 1
      const validMoves: Position[] = []

      // Helper function to check if position is occupied
      const isOccupied = (row: number, col: number) => {
        return allPieces.some(p => p.position.row === row && p.position.col === col)
      }

      // Helper function to check if position has enemy piece
      const hasEnemyPiece = (row: number, col: number) => {
        const pieceAtPosition = allPieces.find(p => p.position.row === row && p.position.col === col)
        return pieceAtPosition && pieceAtPosition.color !== color
      }

      // Move forward one square
      const oneForward = { row: position.row + direction, col: position.col }
      if (oneForward.row >= 0 && oneForward.row < 8 && !isOccupied(oneForward.row, oneForward.col)) {
        validMoves.push(oneForward)

        // Move forward two squares from starting position
        if (position.row === startRow) {
          const twoForward = { row: position.row + 2 * direction, col: position.col }
          if (twoForward.row >= 0 && twoForward.row < 8 && !isOccupied(twoForward.row, twoForward.col)) {
            validMoves.push(twoForward)
          }
        }
      }

      // Diagonal captures
      const diagonalLeft = { row: position.row + direction, col: position.col - 1 }
      if (diagonalLeft.row >= 0 && diagonalLeft.row < 8 && diagonalLeft.col >= 0 && 
          hasEnemyPiece(diagonalLeft.row, diagonalLeft.col)) {
        validMoves.push(diagonalLeft)
      }

      const diagonalRight = { row: position.row + direction, col: position.col + 1 }
      if (diagonalRight.row >= 0 && diagonalRight.row < 8 && diagonalRight.col < 8 && 
          hasEnemyPiece(diagonalRight.row, diagonalRight.col)) {
        validMoves.push(diagonalRight)
      }

      return validMoves
    }
  },
  {
    type: 'king',
    getValidMoves: (piece: PieceData, allPieces: PieceData[]) => {
      const { position, color } = piece
      const validMoves: Position[] = []

      // Helper function to check if position is occupied by own piece
      const isOccupiedByOwnPiece = (row: number, col: number) => {
        const pieceAtPosition = allPieces.find(p => p.position.row === row && p.position.col === col)
        return pieceAtPosition && pieceAtPosition.color === color
      }

      // King can move one square in any direction
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ]

      for (const [rowOffset, colOffset] of directions) {
        const newRow = position.row + rowOffset
        const newCol = position.col + colOffset

        // Check if the new position is within board bounds
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          // King can move to empty squares or capture enemy pieces
          if (!isOccupiedByOwnPiece(newRow, newCol)) {
            validMoves.push({ row: newRow, col: newCol })
          }
        }
      }

      return validMoves
    }
  }
]

export function usePieceRules() {
  const [selectedPiece, setSelectedPiece] = useState<PieceData | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])

  const selectPiece = useCallback((piece: PieceData, allPieces: PieceData[]) => {
    const rule = pieceRules.find(r => r.type === piece.type)
    if (rule) {
      const moves = rule.getValidMoves(piece, allPieces)
      setSelectedPiece(piece)
      setValidMoves(moves)
    }
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedPiece(null)
    setValidMoves([])
  }, [])

  const isValidMove = useCallback((position: Position) => {
    return validMoves.some(move => move.row === position.row && move.col === position.col)
  }, [validMoves])

  return {
    selectedPiece,
    validMoves,
    selectPiece,
    clearSelection,
    isValidMove
  }
}