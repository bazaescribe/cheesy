// src/components/InitRun.tsx
'use client';
import { useEffect } from 'react';
import { useRun } from '@/store/run';

export default function InitRun() {
  const startRun = useRun(s => s.startRun);
  useEffect(() => { startRun(); }, [startRun]);
  return null;
}
