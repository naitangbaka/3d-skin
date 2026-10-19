import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SkinData, EffectParams, BackgroundSettings, ExportSettings } from '@/types';

const DEFAULT_EFFECTS: EffectParams = {
  scale: 1.0,
  slim: false,
  outline: false,
  outlineIntensity: 0.5,
  outlineColor: '#000000',
  glow: false,
  glowIntensity: 0.5,
  glowColor: '#ffffff'
};

const DEFAULT_BACKGROUND: BackgroundSettings = {
  type: 'color',
  color: '#313233',
  imageUrl: undefined,
  imageOffsetX: 0,
  imageOffsetY: 0,
  imageScale: 1,
  imageRepeat: true
};

const DEFAULT_EXPORT: ExportSettings = {
  width: 512,
  height: 512,
  format: 'png',
  transparent: false
};

export const useSkinStore = defineStore('skin', () => {
  const skin = ref<SkinData | null>(null);
  const effects = ref<EffectParams>({ ...DEFAULT_EFFECTS });
  const background = ref<BackgroundSettings>({ ...DEFAULT_BACKGROUND });
  const exportSettings = ref<ExportSettings>({ ...DEFAULT_EXPORT });

  const hasSkin = computed(() => skin.value !== null);
  const isTransparent = computed(() => background.value.type === 'transparent');

  function setSkin(data: SkinData) {
    skin.value = data;
  }

  function updateEffects(params: Partial<EffectParams>) {
    Object.assign(effects.value, params);
  }

  function updateBackground(settings: Partial<BackgroundSettings>) {
    Object.assign(background.value, settings);
  }

  function updateExport(settings: Partial<ExportSettings>) {
    Object.assign(exportSettings.value, settings);
  }

  function resetEffects() {
    effects.value = { ...DEFAULT_EFFECTS };
  }

  function resetAll() {
    skin.value = null;
    effects.value = { ...DEFAULT_EFFECTS };
    background.value = { ...DEFAULT_BACKGROUND };
    exportSettings.value = { ...DEFAULT_EXPORT };
  }

  return {
    skin,
    effects,
    background,
    exportSettings,
    hasSkin,
    isTransparent,
    setSkin,
    updateEffects,
    updateBackground,
    updateExport,
    resetEffects,
    resetAll
  };
});