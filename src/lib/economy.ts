import { PieceKind } from './types';

export function bountyOf(k: PieceKind): number {
  switch (k) {
    case 'P': return 1;
    case 'N': return 3;
    case 'B': return 3;
    case 'R': return 5;
    case 'Q': return 9;
    case 'K': return 5; // bonus adicional por ronda se suma aparte
  }
}

export function roundBonus(round: number): number {
  return 2 + Math.floor(round / 3);
}

export function applyInterest(gold: number, cap = 3): { interest: number; total: number } {
  const interest = Math.min(Math.floor(gold * 0.10), cap);
  return { interest, total: gold + interest };
}

export const PRICES: Record<Exclude<PieceKind, 'K'>, number> = {
  P: 3, N: 7, B: 7, R: 12, Q: 20,
};
