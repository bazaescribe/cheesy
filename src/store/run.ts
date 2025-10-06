'use client';
import { create } from 'zustand';
import { Chess } from 'chess.js';
import { nanoid } from 'nanoid';
import { genShop } from '@/lib/shop';
import { applyInterest, bountyOf, roundBonus } from '@/lib/economy';
import { genStage } from '@/lib/stage';
import { listKills } from '@/lib/utils';
import type { ArmySlot, Offer, PieceKind, RoundOutcome, Shop } from '@/lib/types';
import { mulberry32 } from '@/lib/rng';

type Phase = 'deploy' | 'battle' | 'shop' | 'gameover';

type RunState = {
  seed: number;
  round: number;
  gold: number;
  interestCap: number;
  slots: number;
  army: ArmySlot[];
  kingAlive: boolean;
  phase: Phase;
  fen: string;         // posición actual
  prevFen?: string;    // para calcular kills simples
  shop?: Shop;
};

type Actions = {
  startRun: () => void;
  placePiece: (id: string, square: string) => void;
  buyOffer: (offer: Offer) => void;
  rerollShop: () => void;
  startBattle: () => void;
  onMove: (from: string, to: string) => void;
  endBattleIfOver: () => void;
  nextRoundFromVictory: () => void;
  makeAIMove: () => void; // Just the type signature, no implementation
};

const initial = (): RunState => ({
  seed: Math.floor(Math.random() * 1e9),
  round: 1,
  gold: 0,
  interestCap: 3,
  slots: 3,
  army: [],   // compras se agregan aquí, se auto despliegan simple
  kingAlive: true,
  phase: 'deploy',
  fen: new Chess().fen(),
});

export const useRun = create<RunState & Actions>((set, get) => ({
  ...initial(),

  startRun: () => {
    const s = get();
    const fresh = initial();               // resetea todo
    set({
      ...fresh,
      seed: s.seed,                        // conserva seed si quieres reproducibilidad
      phase: 'deploy',                     // arrancamos en deploy
      round: 1,
      gold: 0,
    });
  },


  buyOffer: (offer) => {
    const s = get();
    if (!s.shop) return;
    if (s.gold < offer.price) return;
    if (s.army.length >= s.slots) return;
    set({
      gold: s.gold - offer.price,
      army: [...s.army, { id: nanoid(), kind: offer.kind }],
      shop: { ...s.shop, offers: s.shop.offers.filter((o: Offer) => o.id !== offer.id) }
    });
  },

  rerollShop: () => {
    const s = get();
    if (!s.shop) return;
    if (s.gold < s.shop.rerollCost) return;
    const rng = mulberry32(s.seed + s.round * 13);
    set({
      gold: s.gold - s.shop.rerollCost,
      shop: { ...genShop(rng), rerollCost: s.shop.rerollCost + 1 }
    });
  },

  startBattle: () => {
    const s = get();
    const armyKinds = s.army.map(a => a.kind);
    const { fen } = genStage(s.seed, s.round, armyKinds);
    set({ fen, prevFen: fen, phase: 'battle' });
  },

  onMove: (from, to) => {
    const s = get();
    const chess = new Chess(s.fen);
    const move = chess.move({ from, to, promotion: 'q' });
    if (!move) return;
    const newFen = chess.fen();
    set({ fen: newFen, prevFen: s.fen });
  },

  endBattleIfOver: () => {
    const s = get();
    const chess = new Chess(s.fen);
    if (chess.isCheckmate() && chess.turn() === 'b') {
      // jaque mate al negro
      const kills = listKills(s.prevFen || s.fen, s.fen) as PieceKind[];
      const base = kills.reduce((acc, k) => acc + bountyOf(k), 0);
      const bonus = roundBonus(s.round);
      const streak = 1; // para MP considera no pérdidas reales todavía
      const totalRaw = s.gold + base + bonus + streak;
      const { total, interest } = applyInterest(totalRaw, s.interestCap);

      const rng = mulberry32(s.seed + s.round * 97);
      const shop = genShop(rng);

      set({
        gold: total,
        shop,
        phase: 'shop',
      });
    }
    // derrota
    const whiteKing = chess.board().flat().find(p => p?.type === 'k' && p.color === 'w');
    if (!whiteKing) {
      set({ phase: 'gameover' });
    }
  },

  nextRoundFromVictory: () => {
    const s = get();
    set({
      round: s.round + 1,
      phase: 'deploy',
      // para este MP hacemos deploy automático al inicio de battle
    });
  },

  makeAIMove: () => {
    const s = get();
    const chess = new Chess(s.fen);
    if (chess.turn() !== 'b') return;
    
    const moves = chess.moves();
    if (moves.length === 0) return;
    
    // Simple random AI for now
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    const move = chess.move(randomMove);
    if (move) {
      set({ fen: chess.fen(), prevFen: s.fen });
    }
  },

  placePiece: () => { /* para una fase de despliegue manual futura */ },
}));
