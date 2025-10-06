import { nanoid } from 'nanoid';
import { Shop } from './types';
import { PRICES } from './economy';

const dist: Array<{ kind: 'P' | 'N' | 'B' | 'R' | 'Q'; p: number }> = [
  { kind: 'P', p: 0.50 },
  { kind: 'N', p: 0.125 },
  { kind: 'B', p: 0.125 },
  { kind: 'R', p: 0.20 },
  { kind: 'Q', p: 0.05 },
];

function weightedPick(rng: () => number) {
  const r = rng();
  let acc = 0;
  for (const o of dist) {
    acc += o.p;
    if (r <= acc) return o.kind;
  }
  return 'P';
}

export function genShop(rng: () => number): Shop {
  const set = new Set<string>();
  const offers = [];
  while (offers.length < 3) {
    const k = weightedPick(rng);
    const key = k;
    if (set.has(key)) continue;
    set.add(key);
    offers.push({ id: nanoid(), kind: k, price: PRICES[k] });
  }
  return { offers, rerollCost: 2 };
}
