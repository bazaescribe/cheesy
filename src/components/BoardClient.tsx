'use client';

import { Chessboard } from 'react-chessboard';
import { useRun } from '@/store/run';
import { Chess } from 'chess.js';
import { useEffect, useMemo } from 'react';

type PieceDropArgs = { piece: string; sourceSquare: string; targetSquare: string };

export default function BoardClient() {
  const fen = useRun(s => s.fen);
  const phase = useRun(s => s.phase);
  const onMove = useRun(s => s.onMove);
  const endBattleIfOver = useRun(s => s.endBattleIfOver);
  const makeAIMove = useRun(s => s.makeAIMove);

  useEffect(() => {
    if (phase === 'battle') {
      // chequea fin al render
      setTimeout(() => endBattleIfOver(), 0);
    }
  }, [fen, phase, endBattleIfOver]);

  const handleDrop = ({ sourceSquare, targetSquare }: any) => {
    if (phase !== 'battle') return false;
    const chess = new Chess(fen);
    const move = chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (!move) return false;
    onMove(sourceSquare, targetSquare);
    return true;
  };

  // Construye el objeto options para evitar recrearlo en cada render
  const options = useMemo(
    () => ({
      position: fen,
      onPieceDrop: handleDrop,
      areArrowsAllowed: true,
    }),
    [fen, handleDrop]
  );

  return (
    <div id="game-board" className="w-full max-w-[520px]">
      <Chessboard options={options} />

    </div>
  );
}
