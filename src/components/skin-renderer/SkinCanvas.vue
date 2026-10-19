<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSkinRenderer } from '@/composables/useSkinRenderer';
import { useSkinStore } from '@/stores/skinStore';
import { Button, Textfield } from '@oreui-web/vue';
import { IconRefresh, IconPencilRuler, IconEdit } from '@iconify-prerendered/vue-pixel';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const store = useSkinStore();

const { theta, phi, resetCamera, setRotation } = useSkinRenderer(canvasRef);

const showAnglePopover = ref(false);
const angleInputTheta = ref('');
const angleInputPhi = ref('');

const isEditingBg = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragOffsetStartX = ref(0);
const dragOffsetStartY = ref(0);
const isDragging = ref(false);

const thetaDeg = computed(() => ((theta.value * 180) / Math.PI).toFixed(1));
const phiDeg = computed(() => ((phi.value * 180) / Math.PI).toFixed(1));

function openAnglePopover() {
  angleInputTheta.value = thetaDeg.value;
  angleInputPhi.value = phiDeg.value;
  showAnglePopover.value = true;
}

function applyPreciseAngle() {
  const t = parseFloat(angleInputTheta.value);
  const p = parseFloat(angleInputPhi.value);
  if (!isNaN(t) && !isNaN(p)) {
    setRotation((t * Math.PI) / 180, (p * Math.PI) / 180);
  }
  showAnglePopover.value = false;
}

function handleAngleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    applyPreciseAngle();
  }
}

function enterBgEdit() {
  isEditingBg.value = true;
}

function saveBgEdit() {
  isEditingBg.value = false;
}

function cancelBgEdit() {
  store.updateBackground({ imageOffsetX: 0, imageOffsetY: 0 });
  isEditingBg.value = false;
}

function resetBgEdit() {
  store.updateBackground({ imageOffsetX: 0, imageOffsetY: 0, imageScale: 1 });
}

function onBgMouseDown(event: MouseEvent) {
  if (!isEditingBg.value) return;
  isDragging.value = true;
  dragStartX.value = event.clientX;
  dragStartY.value = event.clientY;
  dragOffsetStartX.value = store.background.imageOffsetX ?? 0;
  dragOffsetStartY.value = store.background.imageOffsetY ?? 0;
}

function onBgMouseMove(event: MouseEvent) {
  if (!isDragging.value || !isEditingBg.value) return;
  const dx = event.clientX - dragStartX.value;
  const dy = event.clientY - dragStartY.value;
  store.updateBackground({
    imageOffsetX: dragOffsetStartX.value + dx,
    imageOffsetY: dragOffsetStartY.value + dy,
  });
}

function onBgMouseUp() {
  isDragging.value = false;
}

function onBgWheel(event: WheelEvent) {
  if (!isEditingBg.value) return;
  event.preventDefault();
  const delta = event.deltaY > 0 ? -0.05 : 0.05;
  const currentScale = store.background.imageScale ?? 1;
  const newScale = Math.max(0.1, Math.min(5.0, currentScale + delta));
  store.updateBackground({ imageScale: newScale });
}

const canvasWrapperStyle = computed(() => {
  if (store.background.type === 'image' && store.background.imageUrl) {
    const x = store.background.imageOffsetX ?? 0;
    const y = store.background.imageOffsetY ?? 0;
    const scale = store.background.imageScale ?? 1;
    const repeat = store.background.imageRepeat ?? true;
    return {
      backgroundImage: `url(${store.background.imageUrl})`,
      backgroundSize: `${scale * 100}%`,
      backgroundPosition: `calc(50% + ${x}px) calc(50% + ${y}px)`,
      backgroundRepeat: repeat ? 'repeat' : 'no-repeat',
      cursor: isEditingBg.value ? (isDragging.value ? 'grabbing' : 'grab') : 'default',
    };
  }
  if (store.isTransparent) {
    return {};
  }
  return { backgroundColor: store.background.color };
});

const canvasFilter = computed(() => {
  const filters: string[] = [];

  if (store.effects.outline) {
    const alpha = store.effects.outlineIntensity;
    const color = store.effects.outlineColor;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const rgba = `rgba(${r},${g},${b},${alpha})`;
    const offset = Math.round(store.effects.outlineIntensity * 3 + 1);
    filters.push(
      `drop-shadow(${offset}px 0 0 ${rgba})`,
      `drop-shadow(-${offset}px 0 0 ${rgba})`,
      `drop-shadow(0 ${offset}px 0 ${rgba})`,
      `drop-shadow(0 -${offset}px 0 ${rgba})`
    );
  }

  if (store.effects.glow) {
    const blur = store.effects.glowIntensity * 24 + 4;
    const color = store.effects.glowColor;
    filters.push(`drop-shadow(0 0 ${blur}px ${color})`);
    if (store.effects.glowIntensity > 0.5) {
      filters.push(`drop-shadow(0 0 ${blur * 1.8}px ${color})`);
    }
  }

  return filters.join(' ');
});
</script>

<template>
  <div
    class="skin-canvas-wrapper"
    :class="{ 'is-transparent': store.isTransparent, 'is-editing-bg': isEditingBg }"
    :style="canvasWrapperStyle"
    @mousedown="onBgMouseDown"
    @mousemove="onBgMouseMove"
    @mouseup="onBgMouseUp"
    @mouseleave="onBgMouseUp"
    @wheel="onBgWheel"
  >
    <canvas
      ref="canvasRef"
      class="skin-canvas"
      :class="{ 'is-pointer-events-disabled': isEditingBg }"
      :style="{ filter: canvasFilter }"
    />

    <div v-if="!isEditingBg" class="angle-info">
      <span class="angle-label">水平 {{ thetaDeg }}°</span>
      <span class="angle-sep">|</span>
      <span class="angle-label">垂直 {{ phiDeg }}°</span>
    </div>

    <div v-if="!isEditingBg" class="corner-controls">
      <Button
        v-if="store.background.type === 'image' && store.background.imageUrl"
        variant="secondary"
        size="small"
        aria-label="编辑背景位置"
        title="编辑背景位置"
        @click="enterBgEdit"
      >
        <IconEdit class="ctrl-icon" width="18" height="18" />
      </Button>
      <Button
        variant="secondary"
        size="small"
        aria-label="重置角度"
        title="重置角度"
        @click="resetCamera"
      >
        <IconRefresh class="ctrl-icon" width="18" height="18" />
      </Button>
      <Button
        variant="secondary"
        size="small"
        aria-label="精确角度"
        title="精确角度"
        @click="openAnglePopover"
      >
        <IconPencilRuler class="ctrl-icon" width="18" height="18" />
      </Button>
    </div>

    <div v-else class="corner-controls edit-bg-controls">
      <Button color="secondary" size="small" @click="cancelBgEdit">取消</Button>
      <Button color="secondary" size="small" @click="resetBgEdit">重置</Button>
      <Button variant="primary" size="small" @click="saveBgEdit">保存</Button>
    </div>

    <Teleport to="body">
      <div v-if="showAnglePopover" class="angle-popover-mask" @click.self="showAnglePopover = false">
        <div class="angle-popover" @keydown="handleAngleKeydown">
          <h4 class="popover-title">精确角度</h4>
          <div class="popover-field">
            <label>水平角度 (°)</label>
            <Textfield v-model="angleInputTheta" placeholder="例如 -45" />
          </div>
          <div class="popover-field">
            <label>垂直角度 (°)</label>
            <Textfield v-model="angleInputPhi" placeholder="例如 30" />
          </div>
          <div class="popover-actions">
            <Button color="secondary" variant="default" class="angle-cancel" @click="showAnglePopover = false">取消</Button>
            <Button variant="primary" @click="applyPreciseAngle">应用</Button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.skin-canvas-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  padding-bottom: 40px;
}

.skin-canvas-wrapper.is-transparent {
  background-image:
    linear-gradient(45deg, #555 25%, transparent 25%),
    linear-gradient(-45deg, #555 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #555 75%),
    linear-gradient(-45deg, transparent 75%, #555 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.skin-canvas-wrapper.is-editing-bg::after {
  content: '拖动调整位置，滚轮缩放';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 14px;
  border-radius: 6px;
  pointer-events: none;
  user-select: none;
}

.skin-canvas {
  width: 100%;
  height: 100%;
}

.skin-canvas.is-pointer-events-disabled {
  pointer-events: none;
}

.angle-info {
  position: absolute;
  bottom: 12px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  pointer-events: none;
  user-select: none;
}

.angle-label {
  font-size: 13px;
  font-family: monospace;
  color: var(--ore-color-foreground);
}

.angle-sep {
  font-size: 13px;
  color: var(--ore-color-gray-50);
}

.corner-controls {
  position: absolute;
  bottom: 12px;
  right: 16px;
  display: flex;
  gap: 8px;
}

.ctrl-icon {
  width: 18px;
  height: 18px;
  display: block;
}

.angle-popover-mask {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.angle-popover {
  background-color: var(--ore-color-gray-80);
  border-radius: 12px;
  padding: 24px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.popover-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--ore-color-foreground);
}

.popover-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.popover-field label {
  font-size: 14px;
  color: var(--ore-color-gray-20);
}

.popover-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}

@media (max-width: 599px) {
  .corner-controls {
    bottom: 8px;
    right: 8px;
    gap: 6px;
  }

  .corner-controls :deep(ore-button) {
    --ore-button-unit: calc(var(--ore-size-pixel) * 1.6);
    min-width: calc(var(--ore-button-unit) * 40);
    padding: 0 calc(var(--ore-button-unit) * 5) calc(var(--ore-button-unit) * 2);
  }

  .angle-popover {
    width: 90vw;
    max-width: 320px;
    padding: 16px;
  }
}
</style>