import type { MojangProfileResponse } from '@/types';

const PROXY_BASE = import.meta.env.VITE_MOJANG_PROXY || '';

// GitHub Pages 等纯静态托管无法自建服务端代理，
// 当未配置自建代理时，通过公共 CORS 代理转发请求以规避浏览器跨域限制。
const CORS_PROXY = import.meta.env.VITE_CORS_PROXY || 'https://api.allorigins.win/raw?url=';

/**
 * 解析最终请求 URL。
 * - 开发环境：走 Vite 本地代理，无跨域问题，直连即可
 * - 已配置自建代理 PROXY_BASE：直连对应地址
 * - 线上且未配置代理：统一包裹到公共 CORS 代理后面
 */
function resolveRequestUrl(base: string, path: string): string {
  const original = `${base}${path}`;

  if (import.meta.env.DEV) return original;
  if (PROXY_BASE) return original;

  return `${CORS_PROXY}${encodeURIComponent(original)}`;
}

const MOJANG_API_BASE = import.meta.env.DEV
  ? '/api/mojang'
  : (PROXY_BASE || 'https://api.mojang.com');

const SESSION_SERVER = import.meta.env.DEV
  ? '/api/sessionserver'
  : (PROXY_BASE || 'https://sessionserver.mojang.com');

export async function getUUIDByUsername(username: string): Promise<string | null> {
  try {
    const path = `/users/profiles/minecraft/${encodeURIComponent(username)}`;
    const response = await fetch(resolveRequestUrl(MOJANG_API_BASE, path));
    if (!response.ok) return null;
    const data = await response.json() as { id: string; name: string };
    return data.id;
  } catch {
    return null;
  }
}

export async function getProfileByUUID(uuid: string): Promise<MojangProfileResponse | null> {
  try {
    const path = `/session/minecraft/profile/${uuid}`;
    const response = await fetch(resolveRequestUrl(SESSION_SERVER, path));
    if (!response.ok) return null;
    const data = await response.json() as MojangProfileResponse;
    return data;
  } catch {
    return null;
  }
}

export function getSkinUrlFromProfile(profile: MojangProfileResponse): string | null {
  const texturesProperty = profile.properties.find(p => p.name === 'textures');
  if (!texturesProperty) return null;

  try {
    const decoded = atob(texturesProperty.value);
    const textures = JSON.parse(decoded) as {
      textures?: {
        SKIN?: { url: string };
      };
    };
    const rawUrl = textures.textures?.SKIN?.url;
    if (!rawUrl) return null;
    return rawUrl.startsWith('http:') ? rawUrl.replace('http://', 'https://') : rawUrl;
  } catch {
    return null;
  }
}

export async function getSkinUrlByUsername(username: string): Promise<string | null> {
  const uuid = await getUUIDByUsername(username);
  if (!uuid) return null;

  const profile = await getProfileByUUID(uuid);
  if (!profile) return null;

  return getSkinUrlFromProfile(profile);
}