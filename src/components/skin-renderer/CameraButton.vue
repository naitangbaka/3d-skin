<script setup lang="ts">
import { ref } from 'vue';
import { useSkinStore } from '@/stores/skinStore';
import { Button } from '@oreui-web/vue';
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

function captureWithEffects(): string | null {
  const canvas = document.querySelector('.skin-canvas') as HTMLCanvasElement;
  if (!canvas) return null;

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
  if (!ctx) return null;

  if (store.isTransparent) {
    ctx.clearRect(0, 0, destW, destH);
  } else {
    ctx.fillStyle = store.background.color;
    ctx.fillRect(0, 0, destW, destH);
  }

  if (cssFilter && cssFilter !== 'none') {
    ctx.filter = cssFilter;
  }
  ctx.drawImage(canvas, padding, padding, srcW, srcH);

  return offscreen.toDataURL('image/png');
}

function openCaptureModal() {
  const dataUrl = captureWithEffects();
  if (!dataUrl) return;
  previewUrl.value = dataUrl;
  showModal.value = true;
}

function handleDownload() {
  const dataUrl = captureWithEffects();
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
      <svg class="camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M8 6L9.5 4h5L16 6" />
      </svg>
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
            <Button variant="primary" @click="handleDownload">
              下载
            </Button>
            <Button variant="secondary" @click="handleClose">
              返回
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
</style>