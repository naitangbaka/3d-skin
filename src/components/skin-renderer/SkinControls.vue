<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSkinStore } from '@/stores/skinStore';
import { useSkinSource } from '@/composables/useSkinSource';
import { BackgroundType } from '@/types';
import {
  Button,
  Card,
  Dropdown,
  Slider,
  Switch,
  Textfield
} from '@oreui-web/vue';

const store = useSkinStore();
const { loading, error, uploadSkin, fetchSkinByUsername } = useSkinSource();

const username = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

const backgroundTypeLabels: Record<BackgroundType, string> = {
  [BackgroundType.COLOR]: '纯色',
  [BackgroundType.TRANSPARENT]: '透明'
};

const currentBackgroundTypeLabel = computed(
  () => backgroundTypeLabels[store.background.type]
);

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    uploadSkin(file);
  }
}

function triggerFileUpload() {
  fileInput.value?.click();
}

async function handleFetchByUsername() {
  if (!username.value.trim()) return;
  await fetchSkinByUsername(username.value);
}

function openColorPicker(refKey: string) {
  const el = document.querySelector(`[data-color-ref="${refKey}"]`) as HTMLInputElement | null;
  el?.click();
}
</script>

<template>
  <div class="skin-controls">
    <Card class="control-section">
      <h3 class="section-title">皮肤来源</h3>

      <div class="source-group">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden-input"
          @change="handleFileChange"
        />
        <Button variant="primary" @click="triggerFileUpload">
          上传皮肤文件
        </Button>

        <div class="username-input">
          <Textfield
            v-model="username"
            placeholder="输入玩家用户名"
            @keyup.enter="handleFetchByUsername"
          />
          <template v-if="username.trim()">
            <Button
              variant="secondary"
              :disabled="loading"
              @click="handleFetchByUsername"
            >
              获取
            </Button>
          </template>
          <template v-else>
            <Button
              variant="secondary"
              disabled
              class="fetch-btn-disabled"
            >
              获取
            </Button>
          </template>
        </div>
      </div>

      <p v-if="error" class="error-text">{{ error }}</p>
      <p v-if="store.skin" class="skin-info">
        当前皮肤: {{ store.skin.playerName || store.skin.originalName || '自定义' }}
      </p>
    </Card>

    <Card class="control-section">
      <h3 class="section-title">效果调整</h3>

      <div class="control-item">
        <label>缩放</label>
        <Slider
          :model-value="store.effects.scale"
          :min="0.4"
          :max="3"
          :step="0.1"
          @update:model-value="(v: number) => store.updateEffects({ scale: v })"
        />
        <span class="value-display">{{ store.effects.scale.toFixed(2) }}x</span>
      </div>

      <div class="control-item">
        <label>纤细模型</label>
        <Switch
          :model-value="store.effects.slim"
          @update:model-value="(v: boolean) => store.updateEffects({ slim: v })"
        />
      </div>

      <div class="control-item">
        <label>描边</label>
        <Switch
          :model-value="store.effects.outline"
          @update:model-value="(v: boolean) => store.updateEffects({ outline: v })"
        />
      </div>

      <template v-if="store.effects.outline">
        <div class="control-item sub-item">
          <label>描边强度</label>
          <Slider
            :model-value="store.effects.outlineIntensity"
            :min="0"
            :max="1"
            :step="0.01"
            @update:model-value="(v: number) => store.updateEffects({ outlineIntensity: v })"
          />
          <span class="value-display">{{ (store.effects.outlineIntensity * 100).toFixed(0) }}%</span>
        </div>

        <div class="control-item sub-item">
          <label>描边颜色</label>
          <div class="color-picker-row">
            <div
              class="color-swatch"
              :style="{ backgroundColor: store.effects.outlineColor }"
              @click="openColorPicker('outline')"
            />
          </div>
          <input
            type="color"
            data-color-ref="outline"
            class="hidden-input"
            :value="store.effects.outlineColor"
            @input="(e) => store.updateEffects({ outlineColor: (e.target as HTMLInputElement).value })"
          />
        </div>
      </template>

      <div class="control-item">
        <label>发光</label>
        <Switch
          :model-value="store.effects.glow"
          @update:model-value="(v: boolean) => store.updateEffects({ glow: v })"
        />
      </div>

      <template v-if="store.effects.glow">
        <div class="control-item sub-item">
          <label>发光强度</label>
          <Slider
            :model-value="store.effects.glowIntensity"
            :min="0"
            :max="1"
            :step="0.01"
            @update:model-value="(v: number) => store.updateEffects({ glowIntensity: v })"
          />
          <span class="value-display">{{ (store.effects.glowIntensity * 100).toFixed(0) }}%</span>
        </div>

        <div class="control-item sub-item">
          <label>发光颜色</label>
          <div class="color-picker-row">
            <div
              class="color-swatch"
              :style="{ backgroundColor: store.effects.glowColor }"
              @click="openColorPicker('glow')"
            />
          </div>
          <input
            type="color"
            data-color-ref="glow"
            class="hidden-input"
            :value="store.effects.glowColor"
            @input="(e) => store.updateEffects({ glowColor: (e.target as HTMLInputElement).value })"
          />
        </div>
      </template>
    </Card>

    <Card class="control-section">
      <h3 class="section-title">背景设置</h3>

      <div class="control-item">
        <label>背景类型</label>
        <Dropdown
          class="bg-type-dropdown"
          :model-value="store.background.type"
          @update:model-value="(v: string) => store.updateBackground({ type: v as 'color' | 'transparent' })"
        >
          <div class="ore-dropdown-trigger">
            <span class="ore-dropdown-trigger-label">{{ currentBackgroundTypeLabel }}</span>
          </div>
          <div class="ore-dropdown-menu">
            <div class="ore-dropdown-item" data-value="color">纯色</div>
            <div class="ore-dropdown-item" data-value="transparent">透明</div>
          </div>
        </Dropdown>
      </div>

      <div v-show="store.background.type === 'color'" class="control-item">
        <label>背景颜色</label>
        <div class="color-picker-row">
          <div
            class="color-swatch"
            :style="{ backgroundColor: store.background.color }"
            @click="openColorPicker('bg')"
          />
        </div>
        <input
          type="color"
          data-color-ref="bg"
          class="hidden-input"
          :value="store.background.color"
          @input="(e) => store.updateBackground({ color: (e.target as HTMLInputElement).value })"
        />
      </div>
    </Card>
  </div>
</template>

<style scoped>
.skin-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}

.control-section {
  padding: 16px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--ore-color-foreground);
}

.source-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hidden-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.username-input {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.username-input :deep(.oreui-textfield) {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.error-text {
  color: var(--ore-color-red-10);
  font-size: 14px;
  margin-top: 8px;
}

.skin-info {
  color: var(--ore-color-gray-30);
  font-size: 14px;
  margin-top: 8px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.control-item label {
  min-width: 80px;
  font-size: 14px;
  color: var(--ore-color-foreground);
}

.control-item :deep(.oreui-slider) {
  flex: 1;
}

.value-display {
  min-width: 48px;
  text-align: right;
  font-size: 14px;
  color: var(--ore-color-gray-30);
}

.sub-item {
  padding-left: 20px;
}

.bg-type-dropdown {
  flex: 1;
  min-width: 0;
}

.bg-type-dropdown :deep(.ore-dropdown-trigger) {
  --btn-unit: var(--ore-size-unit);
  --btn-bg: #3C8527;
  --btn-bg-hover: #52A535;
  --btn-bg-pressed: #2A641C;
  --btn-highlight: color-mix(in srgb, #3C8527, var(--ore-color-white) 10%);
  --btn-highlight-hover: color-mix(in srgb, #52A535, var(--ore-color-white) 10%);
  --btn-highlight-pressed: color-mix(in srgb, #2A641C, var(--ore-color-black) 10%);
  --btn-border: var(--ore-color-border);
  --btn-shadow: color-mix(in srgb, #3C8527, var(--ore-color-black) 30%);

  display: inline-flex;
  align-items: center;
  min-height: calc(var(--btn-unit) * 22);
  padding: 0 calc(var(--btn-unit) * 10);
  color: var(--ore-color-foreground);
  font-family: var(--ore-font-body);
  font-size: calc(var(--btn-unit) * 7);
  font-weight: 400;
  line-height: 1;
  cursor: pointer;
  background:
    linear-gradient(var(--btn-border), var(--btn-border)) center 0 / 100% var(--btn-unit) no-repeat,
    linear-gradient(var(--btn-border), var(--btn-border)) center bottom / 100% var(--btn-unit) no-repeat,
    linear-gradient(var(--btn-border), var(--btn-border)) left 0 / var(--btn-unit) 100% no-repeat,
    linear-gradient(var(--btn-border), var(--btn-border)) right 0 / var(--btn-unit) 100% no-repeat,
    linear-gradient(var(--btn-shadow), var(--btn-shadow)) center calc(100% - var(--btn-unit)) / calc(100% - var(--btn-unit) * 2) calc(var(--btn-unit) * 2) no-repeat,
    linear-gradient(var(--btn-highlight), var(--btn-highlight)) center var(--btn-unit) / calc(100% - var(--btn-unit) * 2) var(--btn-unit) no-repeat,
    linear-gradient(var(--btn-highlight), var(--btn-highlight)) center calc(100% - var(--btn-unit) * 3) / calc(100% - var(--btn-unit) * 2) var(--btn-unit) no-repeat,
    linear-gradient(var(--btn-highlight), var(--btn-highlight)) left var(--btn-unit) / calc(var(--btn-unit) * 2) calc(100% - var(--btn-unit) * 4 - 1px) no-repeat,
    linear-gradient(var(--btn-highlight), var(--btn-highlight)) right var(--btn-unit) / calc(var(--btn-unit) * 2) calc(100% - var(--btn-unit) * 4 - 1px) no-repeat,
    linear-gradient(var(--btn-bg), var(--btn-bg)) center 0 / 100% 100% no-repeat;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.bg-type-dropdown :deep(.ore-dropdown-trigger)::after {
  top: 55% !important;
}

.bg-type-dropdown :deep(.ore-dropdown-trigger:hover) {
  --btn-bg: var(--btn-bg-hover);
  --btn-highlight: var(--btn-highlight-hover);
}

.bg-type-dropdown :deep(.ore-dropdown-trigger:active) {
  --btn-bg: var(--btn-bg-pressed);
  --btn-highlight: var(--btn-highlight-pressed);
}

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 2px solid var(--ore-color-gray-60);
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.15s;
}

.color-swatch:focus {
  border-color: var(--ore-color-foreground);
}

.fetch-btn-disabled,
.fetch-btn-disabled:active,
.fetch-btn-disabled:is([pressed], :active) {
  cursor: not-allowed;
  --ore-button-face-offset: 0px;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

@media (max-width: 599px) {
  .skin-controls {
    align-items: center;
  }

  .control-section {
    width: 100%;
    max-width: 420px;
  }
}
</style>