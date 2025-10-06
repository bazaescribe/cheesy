'use client';
import { useRun } from '@/store/run';

export default function HUD() {
  const gold = useRun(s => s.gold);
  const round = useRun(s => s.round);
  const phase = useRun(s => s.phase);
  const startRun = useRun(s => s.startRun);
  const startBattle = useRun(s => s.startBattle);
  const nextRoundFromVictory = useRun(s => s.nextRoundFromVictory);

  return (
    <div className="space-y-3">
      <div className="text-xl font-semibold">Ronda {round}</div>
      <div>Oro {gold}</div>
      <div className="text-sm opacity-70">Fase {phase}</div>

      {phase === 'deploy' && (
        <div className="flex gap-2">
          <button onClick={startRun} className="px-3 py-2 rounded-2xl border">Nueva run</button>
          <button onClick={startBattle} className="px-3 py-2 rounded-2xl bg-black text-white">
            Iniciar batalla
          </button>
        </div>
      )}

      {phase === 'shop' && (
        <button onClick={nextRoundFromVictory} className="px-3 py-2 rounded-2xl bg-black text-white">
          Siguiente ronda
        </button>
      )}

      {phase === 'gameover' && (
        <button onClick={startRun} className="px-3 py-2 rounded-2xl bg-black text-white">
          Nueva run
        </button>
      )}

      {phase === 'battle' && (
        <div className="text-sm opacity-70">Mueve piezas blancas. Objetivo: jaque mate al rey negro.</div>
      )}
    </div>
  );
}
