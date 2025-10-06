'use client';
import { useRun } from '@/store/run';

export default function Shop() {
  const shop = useRun(s => s.shop);
  const gold = useRun(s => s.gold);
  const buy = useRun(s => s.buyOffer);
  const reroll = useRun(s => s.rerollShop);
  const phase = useRun(s => s.phase);

  if (phase !== 'shop' || !shop) return null;

  return (
    <div className="p-3 rounded-2xl border w-full max-w-md">
      <div className="font-semibold mb-2">Tienda</div>
      <div className="grid grid-cols-3 gap-2">
        {shop.offers.map(o => (
          <button
            key={o.id}
            onClick={() => buy(o)}
            disabled={gold < o.price}
            className="p-2 rounded-xl border text-left"
          >
            <div className="text-lg">{pretty(o.kind)}</div>
            <div className="text-sm opacity-70">Precio {o.price}</div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={reroll}
          disabled={gold < shop.rerollCost}
          className="px-3 py-2 rounded-2xl bg-black text-white"
        >
          Reroll {shop.rerollCost}
        </button>
        <div className="text-sm opacity-70">Oro {gold}</div>
      </div>
    </div>
  );
}

function pretty(k: string) {
  switch (k) {
    case 'P': return 'Peón';
    case 'N': return 'Caballo';
    case 'B': return 'Alfil';
    case 'R': return 'Torre';
    case 'Q': return 'Dama';
    default: return k;
  }
}
