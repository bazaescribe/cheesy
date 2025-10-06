import { Chess, Square } from 'chess.js';
import { hashSeed, mulberry32 } from './rng';

type Pool = { kind: 'P' | 'N' | 'B' | 'R' | 'Q'; cost: number; weight: number };

function enemyBudget(round: number): number {
  if (round <= 1) return 0;
  if (round === 2) return 8;
  if (round === 3) return 12;
  if (round === 4) return 18;
  if (round === 5) return 24;
  return Math.round(6 + 4 * round + 0.8 * round * round);
}

function allSquares(): Square[] {
  const files = 'abcdefgh';
  const ranks = '12345678';
  const res: Square[] = [];
  for (const f of files) for (const r of ranks) res.push(`${f}${r}` as Square);
  return res;
}

function shuffle<T>(arr: T[], rng: () => number) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isPlayerZone(sq: Square) {
  return sq[1] === '1' || sq[1] === '2';
}

function isEnemyKingZone(sq: Square) {
  return sq === 'e8' || sq === 'd8' || sq === 'f8';
}

export function genStage(seed: number, round: number, army: Array<'P'|'N'|'B'|'R'|'Q'>) {
  const rng = mulberry32(hashSeed(seed, round));
  const chess = new Chess();
  chess.clear();

  // Reinos
  chess.put({ type: 'k', color: 'w' }, 'e1');
  chess.put({ type: 'k', color: 'b' }, 'e8');

  // Coloca ejército del jugador en filas 1 y 2 libres
  const playerSlots = shuffle(
    allSquares().filter(s => isPlayerZone(s) && chess.get(s) === null),
    rng
  );

  for (const kind of army) {
    const sq = playerSlots.pop();
    if (!sq) break;
    chess.put({ type: kind.toLowerCase() as 'p' | 'n' | 'b' | 'r' | 'q', color: 'w' }, sq);
  }

  // Ronda 1 especial: agrega un peón si quieres forzar el inicio
  if (round === 1 && !army.includes('P')) {
    chess.put({ type: 'p', color: 'w' }, 'e2');
  }

  // Enemigos por presupuesto
  const BE = enemyBudget(round);
  let used = 0;
  const pool: Pool[] = [
    { kind: 'P', cost: 2, weight: 3 },
    { kind: 'N', cost: 6, weight: 2 },
    { kind: 'B', cost: 6, weight: 2 },
    { kind: 'R', cost: 10, weight: 1.2 },
    { kind: 'Q', cost: 16, weight: 0.8 },
  ];

  function weightedEnemy(): Pool | null {
    const total = pool.reduce((a, b) => a + b.weight, 0);
    let r = rng() * total;
    for (const p of pool) {
      if ((r -= p.weight) <= 0) return p;
    }
    return null;
  }

  const enemySquares = shuffle(
    allSquares().filter(s => !isPlayerZone(s) && !isEnemyKingZone(s) && chess.get(s) === null),
    rng
  );

  for (const sq of enemySquares) {
    const pick = weightedEnemy();
    if (!pick) continue;
    if (used + pick.cost > BE) continue;

    chess.put({ type: pick.kind.toLowerCase() as 'p' | 'n' | 'b' | 'r' | 'q', color: 'b' }, sq);

    // Evita mate en 1 gratis
    if (chess.inCheck()) {
      chess.remove(sq);
      continue;
    }
    used += pick.cost;
    if (used >= BE) break;
  }

  // Ajuste trivial: si el rey negro no está defendido en absoluto, intenta sumar un peón cerca
  if (!chess.inCheck() && used < BE) {
    const near = ['d7', 'e7', 'f7'] as Square[];
    for (const s of near) {
      if (!chess.get(s)) {
        chess.put({ type: 'p', color: 'b' }, s);
        break;
      }
    }
  }

  return { fen: chess.fen(), budgetUsed: used };
}
