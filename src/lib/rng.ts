export function mulberry32(a: number) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function hashSeed(seed: number, round: number) {
  let h = 2166136261 ^ seed;
  h = (h ^ round) * 16777619;
  return h >>> 0;
}
