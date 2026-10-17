import type { MojangProfileResponse } from '@/types';

const MOJANG_API_BASE = import.meta.env.DEV ? '/api/mojang' : 'https://api.mojang.com';
const SESSION_SERVER = import.meta.env.DEV ? '/api/sessionserver' : 'https://sessionserver.mojang.com';

export async function getUUIDByUsername(username: string): Promise<string | null> {
  try {
    const response = await fetch(`${MOJANG_API_BASE}/users/profiles/minecraft/${encodeURIComponent(username)}`);
    if (!response.ok) return null;
    const data = await response.json() as { id: string; name: string };
    return data.id;
  } catch {
    return null;
  }
}

export async function getProfileByUUID(uuid: string): Promise<MojangProfileResponse | null> {
  try {
    const response = await fetch(`${SESSION_SERVER}/session/minecraft/profile/${uuid}`);
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