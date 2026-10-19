// uapis.cn 单接口：仅需用户名即可一次返回 UUID 与皮肤地址。
// 该接口原生支持 CORS（按请求 Origin 回显 Access-Control-Allow-Origin），
// 因此前端可直接跨域请求，无需任何代理层。
const UAPI_BASE = 'https://uapis.cn';
const UAPI_USERINFO_PATH = '/api/v1/game/minecraft/userinfo';

interface UserInfoResponse {
  username: string;
  uuid: string;
  skin_url: string;
  cape_url?: string;
}

function buildUserInfoUrl(username: string): string {
  return `${UAPI_BASE}${UAPI_USERINFO_PATH}?username=${encodeURIComponent(username.trim())}`;
}

/** 根据用户名查询用户信息（UUID + 皮肤链接），失败返回 null。 */
export async function getUserInfoByUsername(username: string): Promise<UserInfoResponse | null> {
  const response = await fetch(buildUserInfoUrl(username), { mode: 'cors' });
  if (!response.ok) return null;
  try {
    const data = (await response.json()) as Partial<UserInfoResponse>;
    return data.uuid ? (data as UserInfoResponse) : null;
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