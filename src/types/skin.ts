export const SkinSourceType = {
  UPLOAD: 'upload',
  API: 'api'
} as const;

export type SkinSourceType = typeof SkinSourceType[keyof typeof SkinSourceType];

export interface SkinData {
  id: string;
  sourceType: SkinSourceType;
  imageUrl: string;
  originalName?: string;
  playerName?: string;
}

export interface EffectParams {
  scale: number;
  slim: boolean;
  outline: boolean;
  outlineIntensity: number;
  outlineColor: string;
  glow: boolean;
  glowIntensity: number;
  glowColor: string;
}

export const BackgroundType = {
  COLOR: 'color',
  TRANSPARENT: 'transparent',
  IMAGE: 'image'
} as const;

export type BackgroundType = typeof BackgroundType[keyof typeof BackgroundType];

export interface BackgroundSettings {
  type: BackgroundType;
  color: string;
  imageUrl?: string;
  imageOffsetX?: number;
  imageOffsetY?: number;
  imageScale?: number;
  imageRepeat?: boolean;
}

export interface ExportSettings {
  width: number;
  height: number;
  format: 'png';
  transparent: boolean;
}

export interface MojangProfileResponse {
  id: string;
  name: string;
  properties: Array<{
    name: string;
    value: string;
  }>;
}