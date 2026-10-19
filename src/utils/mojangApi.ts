const PROXY_BASE = import.meta.env.VITE_MOJANG_PROXY || '';
const CUSTOM_CORS_PROXY = import.meta.env.VITE_CORS_PROXY || '';

// uapis.cn 单接口：仅需用户名即可一次返回 UUID 与皮肤地址。
// 开发环境经 Vite 本地代理转发（避免跨域）；线上直连或经 CORS 代理。
const UAPI_BASE = import.meta.env.DEV ? '/api/uapis' : (PROXY_BASE || 'https://uapis.cn');
const UAPI_USERINFO_PATH = '/api/v1/game/minecraft/userinfo';

interface UserInfoResponse {
  username: string;
  uuid: string;
  skin_url: string;
  cape_url?: string;
}

type ProxyBuilder = (url: string) => string;

// GitHub Pages 等纯静态托管无法自建服务端代理，且 uapis.cn 未返回 CORS 头，
// 因此需要借助 CORS 代理转发。单个公共代理可能不定期失效，内置多个候选按序回退。
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
async function fetchWithFallback(url: string): Promise<Response | null> {
  const candidates: string[] = [];
  if (import.meta.env.DEV || PROXY_BASE) {
    candidates.push(url);
  } else {
    if (CUSTOM_PROXY_BUILDER) candidates.push(CUSTOM_PROXY_BUILDER(url));
    for (const build of PUBLIC_PROXY_BUILDERS) {
      candidates.push(build(url));
    }
  }

  // 依次尝试。单个代理失败（CORS 被拦、网络错误、5xx 等）时换下一个。
  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { mode: 'cors' });
      if (response.ok) return response;
    } catch {
      // 忽略本次失败，继续尝试下一个代理
    }
  }

  return null;
}

function buildUserInfoUrl(username: string): string {
  return `${UAPI_BASE}${UAPI_USERINFO_PATH}?username=${encodeURIComponent(username.trim())}`;
}

/** 根据用户名查询用户信息（UUID + 皮肤链接），失败返回 null。 */
export async function getUserInfoByUsername(username: string): Promise<UserInfoResponse | null> {
  const response = await fetchWithFallback(buildUserInfoUrl(username));
  if (!response) return null;
  try {
    const data = (await response.json()) as Partial<UserInfoResponse>;
    if (!data.uuid) return null;
    return data as UserInfoResponse;
  } catch {
    return null;
  }
}

/** 根据用户名获取皮肤图片地址，失败返回 null。 */
export async function getSkinUrlByUsername(username: string): Promise<string | null> {
  const info = await getUserInfoByUsername(username);
  if (!info?.skin_url) return null;
  return info.skin_url.startsWith('http:')
    ? info.skin_url.replace('http://', 'https://')
    : info.skin_url;
}