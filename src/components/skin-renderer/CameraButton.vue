<script setup lang="ts">
import { ref } from 'vue';
import { useSkinStore } from '@/stores/skinStore';
import { Button } from '@oreui-web/vue';
import { IconRetroCamera } from '@iconify-prerendered/vue-pixel';
import { downloadDataURL, generateFilename } from '@/utils/download';

const store = useSkinStore();
const showModal = ref(false);
const previewUrl = ref('');

function getEffectPadding(): number {
  let padding = 0;
  if (store.effects.outline) {
    padding = Math.max(padding, Math.round(store.effects.outlineIntensity * 3 + 1));
  }
  if (store.effects.glow) {
    const blur = store.effects.glowIntensity * 24 + 4;
    padding = Math.max(padding, blur);
    if (store.effects.glowIntensity > 0.5) {
      padding = Math.max(padding, Math.ceil(blur * 1.8));
    }
  }
  return Math.ceil(padding);
}

function captureWithEffects(): Promise<string | null> {
  return new Promise((resolve) => {
    const canvas = document.querySelector('.skin-canvas') as HTMLCanvasElement;
    const wrapper = document.querySelector('.skin-canvas-wrapper') as HTMLElement;
    if (!canvas || !wrapper) {
      resolve(null);
      return;
    }

    const cssFilter = getComputedStyle(canvas).filter;
    const padding = getEffectPadding();

    const srcW = canvas.width;
    const srcH = canvas.height;
    const destW = srcW + padding * 2;
    const destH = srcH + padding * 2;

    const offscreen = document.createElement('canvas');
    offscreen.width = destW;
    offscreen.height = destH;
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      resolve(null);
      return;
    }

    const drawSkin = () => {
      if (cssFilter && cssFilter !== 'none') {
        ctx.filter = cssFilter;
      }
      ctx.drawImage(canvas, padding, padding, srcW, srcH);
      resolve(offscreen.toDataURL('image/png'));
    };

    if (store.isTransparent) {
      ctx.clearRect(0, 0, destW, destH);
      drawSkin();
    } else if (store.background.type === 'image' && store.background.imageUrl) {
      const wrapperStyle = getComputedStyle(wrapper);
      const bgImage = wrapperStyle.backgroundImage;
      const bgRepeat = wrapperStyle.backgroundRepeat;

      ctx.fillStyle = store.background.color;
      ctx.fillRect(0, 0, destW, destH);

      if (bgImage && bgImage !== 'none') {
        const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = urlMatch[1];
          img.onload = () => {
            drawBackgroundImageFromStore(ctx, img, destW, destH, bgRepeat);
            drawSkin();
          };
          img.onerror = () => {
            drawSkin();
          };
          return;
        }
      }
      drawSkin();
    } else {
      ctx.fillStyle = store.background.color;
      ctx.fillRect(0, 0, destW, destH);
      drawSkin();
    }
  });
}

function drawBackgroundImageFromStore(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  destW: number,
  destH: number,
  bgRepeat: string
) {
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  const scale = store.background.imageScale ?? 1;
  const offsetX = store.background.imageOffsetX ?? 0;
  const offsetY = store.background.imageOffsetY ?? 0;

  const baseScale = Math.max(destW / imgW, destH / imgH);
  const drawW = imgW * baseScale * scale;
  const drawH = imgH * baseScale * scale;

  const centerX = (destW - drawW) / 2 + offsetX;
  const centerY = (destH - drawH) / 2 + offsetY;

  if (bgRepeat === 'repeat') {
    const pattern = ctx.createPattern(img, 'repeat');
    if (pattern) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.fillStyle = pattern;
      ctx.fillRect(-centerX, -centerY, destW, destH);
      ctx.restore();
    }
  } else {
    ctx.drawImage(img, centerX, centerY, drawW, drawH);
  }
}

async function openCaptureModal() {
  const dataUrl = await captureWithEffects();
  if (!dataUrl) return;
  previewUrl.value = dataUrl;
  showModal.value = true;
}

async function handleDownload() {
  const dataUrl = await captureWithEffects();
  if (!dataUrl) return;
  downloadDataURL(dataUrl, generateFilename());
}

function handleClose() {
  showModal.value = false;
  previewUrl.value = '';
}
</script>

<template>
  <div class="camera-button-wrapper">
    <Button
      variant="primary"
      class="camera-btn"
      @click="openCaptureModal"
    >
      <IconRetroCamera class="camera-icon" width="18" height="18" />
      拍摄
    </Button>

    <div v-if="showModal" class="modal-overlay" @click.self="handleClose">
      <div class="modal-content">
        <div class="modal-header">
          <h3>截图预览</h3>
          <button class="close-btn" @click="handleClose">&times;</button>
        </div>

        <div class="capture-modal-content">
          <div class="preview-area">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt="截图预览"
              class="preview-image"
            />
          </div>

          <div class="modal-actions">
            <Button color="secondary" @click="handleClose">
              返回
            </Button>
            <Button variant="primary" @click="handleDownload">
              下载
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.camera-button-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}

.camera-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.camera-icon {
  width: 18px;
  height: 18px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--ore-color-gray-80);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--ore-color-gray-70);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--ore-color-foreground);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--ore-color-gray-30);
  line-height: 1;
}

.close-btn:hover {
  color: var(--ore-color-white);
}

.capture-modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
}

.preview-area {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: var(--ore-color-gray-90);
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .camera-button-wrapper {
    top: 8px;
    right: 8px;
  }

  .camera-btn {
    padding: 6px 10px;
    font-size: 13px;
    min-height: 32px;
  }

  .camera-icon {
    width: 16px;
    height: 16px;
  }

  .modal-content {
    width: 95%;
    max-height: 85vh;
  }

  .modal-header {
    padding: 12px 16px;
  }

  .modal-header h3 {
    font-size: 16px;
  }

  .capture-modal-content {
    padding: 16px;
    gap: 16px;
  }

  .preview-image {
    max-height: 50vh;
  }

  .modal-actions {
    flex-direction: column;
    gap: 8px;
  }

  .modal-actions :deep(button) {
    width: 100%;
  }
}
</style>