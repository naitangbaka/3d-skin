<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSkinRenderer } from '@/composables/useSkinRenderer';
import { useSkinStore } from '@/stores/skinStore';
import { Button, Textfield } from '@oreui-web/vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const store = useSkinStore();

const { theta, phi, resetCamera, setRotation } = useSkinRenderer(canvasRef);

const showAnglePopover = ref(false);
const angleInputTheta = ref('');
const angleInputPhi = ref('');

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
    :class="{ 'is-transparent': store.isTransparent }"
    :style="{ backgroundColor: store.isTransparent ? undefined : store.background.color }"
  >
    <canvas
      ref="canvasRef"
      class="skin-canvas"
      :style="{ filter: canvasFilter }"
    />

    <div class="angle-info">
      <span class="angle-label">水平 {{ thetaDeg }}°</span>
      <span class="angle-sep">|</span>
      <span class="angle-label">垂直 {{ phiDeg }}°</span>
    </div>

    <div class="corner-controls">
      <Button variant="secondary" size="small" @click="resetCamera">
        重置角度
      </Button>
      <Button variant="secondary" size="small" @click="openAnglePopover">
        精确角度
      </Button>
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
            <Button variant="secondary" @click="showAnglePopover = false">取消</Button>
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

.skin-canvas {
  width: 100%;
  height: 100%;
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

  .corner-controls :deep(button) {
    padding: 4px 10px;
    font-size: 12px;
    min-height: 28px;
  }

  .angle-popover {
    width: 90vw;
    max-width: 320px;
    padding: 16px;
  }
}
</style>