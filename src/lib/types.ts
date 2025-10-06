export type PieceKind = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';

export type Offer = { id: string; kind: Exclude<PieceKind, 'K'>; price: number };

export type Shop = { offers: Offer[]; rerollCost: number };

export type ArmySlot = { id: string; kind: Exclude<PieceKind, 'K'> };

export type RoundOutcome = {
  kills: PieceKind[];
  checkmated: boolean;
  losses: string[];
};
