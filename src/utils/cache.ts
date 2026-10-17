import type { SkinData, EffectParams, BackgroundSettings } from '@/types';

const CACHE_KEY = '3d-skin-cache';

export interface CacheData {
  skin: SkinData | null;
  effects: EffectParams;
  background: BackgroundSettings;
}

export function saveCache(data: CacheData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore if localStorage is full or unavailable
  }
}

export function loadCache(): CacheData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CacheData;
  } catch {
    return null;
  }
}

export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

export function hasCache(): boolean {
  return localStorage.getItem(CACHE_KEY) !== null;
}