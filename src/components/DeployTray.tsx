'use client';
import { useRun } from '@/store/run';

export default function DeployTray() {
  const phase = useRun(s => s.phase);
  const army = useRun(s => s.army);
  if (phase !== 'deploy') return null;
  return (
    <div className="p-3 rounded-2xl border w-full max-w-md">
      <div className="font-semibold mb-2">Tu ejército</div>
      <div className="flex gap-2 flex-wrap">
        {army.map(a => (
          <div key={a.id} className="px-2 py-1 rounded-lg border text-sm">
            {pretty(a.kind)}
          </div>
        ))}
      </div>
      <div className="text-sm opacity-70 mt-2">Se colocan automáticamente en tus dos primeras filas.</div>
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
