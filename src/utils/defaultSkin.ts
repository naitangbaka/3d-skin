let cachedGraySkin: string | null = null;

export function getDefaultGraySkin(): string {
  if (cachedGraySkin) return cachedGraySkin;

  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#9E9E9E';
  ctx.fillRect(0, 0, size, size);

  cachedGraySkin = canvas.toDataURL('image/png');
  return cachedGraySkin;
}