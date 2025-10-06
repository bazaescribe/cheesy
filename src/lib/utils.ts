import { Chess } from 'chess.js';

export function listKills(prevFen: string, nextFen: string): string[] {
  const before = new Chess(prevFen);
  const after = new Chess(nextFen);
  const kills: string[] = [];
  // naive: cuenta piezas por color y tipo
  const countsBefore: Record<string, number> = {};
  const countsAfter: Record<string, number> = {};
  for (const b of before.board().flat()) if (b) {
    const k = `${b.color}${b.type}`;
    countsBefore[k] = (countsBefore[k] || 0) + 1;
  }
  for (const a of after.board().flat()) if (a) {
    const k = `${a.color}${a.type}`;
    countsAfter[k] = (countsAfter[k] || 0) + 1;
  }
  // piezas negras desaparecidas son kills del jugador
  for (const k in countsBefore) {
    if (k.startsWith('b')) {
      const diff = (countsBefore[k] || 0) - (countsAfter[k] || 0);
      for (let i = 0; i < diff; i++) kills.push(k[1].toUpperCase());
    }
  }
  return kills;
}
