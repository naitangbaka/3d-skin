import type { MojangProfileResponse } from '@/types';

const PROXY_BASE = import.meta.env.VITE_MOJANG_PROXY || '';
const CUSTOM_CORS_PROXY = import.meta.env.VITE_CORS_PROXY || '';

type ProxyBuilder = (url: string) => string;

// GitHub Pages 等纯静态托管无法自建服务端代理，需要借助公共 CORS 代理逐请求转发。
// 单个公共代理可能不定期失效，因此内置多个候选并按序回退，直到成功为止。
const CUSTOM_PROXY_BUILDER: ProxyBuilder | null = CUSTOM_CORS_PROXY
  ? (url) => `${CUSTOM_CORS_PROXY}${encodeURIComponent(url)}`
  : null;

// 常见公共 CORS 代理，按可靠性排序
const PUBLIC_PROXY_BUILDERS: ProxyBuilder[] = [
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

/**
 * 发起一次可能带 CORS 代理的请求。
 * - 开发环境：走 Vite 本地代理，直连
 * - 已配置自建代理 PROXY_BASE：直连
 * - 线上且无代理配置：依次尝试"自定义代理 + 公共代理"，直到拿到成功响应
 */
async function fetchWithFallback(base: string, path: string): Promise<Response | null> {
  const originalUrl = `${base}${path}`;

  // 收集候选 URL，不足以代理场景直连即可
  const candidates: string[] = [];
  if (import.meta.env.DEV || PROXY_BASE) {
    candidates.push(originalUrl);
  } else {
    if (CUSTOM_PROXY_BUILDER) candidates.push(CUSTOM_PROXY_BUILDER(originalUrl));
    for (const build of PUBLIC_PROXY_BUILDERS) {
      candidates.push(build(originalUrl));
    }
  }

  // 依次尝试。单个代理失败（CORS 被拦、网络错误、5xx 等）时换下一个。
  for (const url of candidates) {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) return response;
    } catch {
      // 忽略本次失败，继续尝试下一个代理
    }
  }

  return null;
}

const MOJANG_API_BASE = import.meta.env.DEV
  ? '/api/mojang'
  : (PROXY_BASE || 'https://api.mojang.com');

const SESSION_SERVER = import.meta.env.DEV
  ? '/api/sessionserver'
  : (PROXY_BASE || 'https://sessionserver.mojang.com');

export async function getUUIDByUsername(username: string): Promise<string | null> {
  const path = `/users/profiles/minecraft/${encodeURIComponent(username)}`;
  const response = await fetchWithFallback(MOJANG_API_BASE, path);
  if (!response) return null;
  try {
    const data = await response.json() as { id: string; name: string };
    return data.id;
  } catch {
    return null;
  }
}

export async function getProfileByUUID(uuid: string): Promise<MojangProfileResponse | null> {
  const path = `/session/minecraft/profile/${uuid}`;
  const response = await fetchWithFallback(SESSION_SERVER, path);
  if (!response) return null;
  try {
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