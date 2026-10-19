<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Navbar, Button } from '@oreui-web/vue';
import { IconBars, IconInfoCircle } from '@iconify-prerendered/vue-pixel';
import SkinCanvas from '@/components/skin-renderer/SkinCanvas.vue';
import SkinControls from '@/components/skin-renderer/SkinControls.vue';
import CameraButton from '@/components/skin-renderer/CameraButton.vue';
import RestoreConfirmModal from '@/components/RestoreConfirmModal.vue';
import AboutModal from '@/components/AboutModal.vue';
import { useSkinStore } from '@/stores/skinStore';
import { hasCache, loadCache, saveCache, clearCache } from '@/utils/cache';
import clickSound from '@/assets/sound/click.mp3';
import titleIcon from '@/assets/title_icon.png';

const store = useSkinStore();
const showRestore = ref(false);
const showControls = ref(false);
const showAbout = ref(false);

const clickAudio = new Audio(clickSound);
clickAudio.preload = 'auto';

function playClickSound() {
  if (clickAudio.paused) {
    clickAudio.currentTime = 0;
    void clickAudio.play();
  }
}

function handleGlobalClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  const clickable = target?.closest(
    'ore-button, ore-switch, ore-checkbox, ore-slider, ' +
      '.color-swatch, .ore-dropdown-trigger, .ore-dropdown-item, ' +
      'button'
  );
  if (
    clickable &&
    !clickable.hasAttribute('disabled') &&
    !clickable.hasAttribute('form-disabled')
  ) {
    playClickSound();
  }
}

const audioCleanup = () => {
  document.removeEventListener('click', handleGlobalClick, true);
  clickAudio.pause();
  clickAudio.src = '';
};

onMounted(() => {
  if (hasCache()) {
    showRestore.value = true;
  }
  document.addEventListener('click', handleGlobalClick, true);
});

onBeforeUnmount(audioCleanup);

let saveTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => ({
    skin: store.skin,
    effects: { ...store.effects },
    background: { ...store.background }
  }),
  (state) => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveCache(state);
    }, 500);
  },
  { deep: true, immediate: false }
);

function handleRestore() {
  const cached = loadCache();
  if (cached) {
    if (cached.skin) {
      store.setSkin(cached.skin);
    }
    store.updateEffects(cached.effects);
    store.updateBackground(cached.background);
  }
  showRestore.value = false;
}

function handleDiscard() {
  clearCache();
  showRestore.value = false;
}

function toggleControls() {
  showControls.value = !showControls.value;
}
</script>

<template>
  <div class="app-container">
    <Navbar class="app-header">
      <div class="header-left">
        <Button
          class="menu-toggle"
          variant="secondary"
          size="small"
          @click="toggleControls"
          aria-label="展开或收起设置面板"
          title="展开或收起设置面板"
        >
          <IconBars class="menu-icon" width="14" height="14" />
        </Button>
        <img :src="titleIcon" alt="3D-SKIN" class="app-title-icon" />
      </div>
      <div class="header-right">
        <Button
          class="about-toggle"
          variant="secondary"
          size="small"
          @click="showAbout = true"
          aria-label="关于 3D-SKIN"
          title="关于 3D-SKIN"
        >
          <IconInfoCircle class="about-icon" width="16" height="16" />
        </Button>
      </div>
    </Navbar>

    <div class="app-body">
      <aside class="sidebar" :class="{ 'sidebar-open': showControls }">
        <SkinControls />
      </aside>

      <div v-if="showControls" class="sidebar-overlay" @click="showControls = false" />

      <main class="main-content">
        <div class="canvas-container">
          <SkinCanvas />
          <CameraButton />
        </div>
      </main>
    </div>

    <RestoreConfirmModal
      v-if="showRestore"
      @restore="handleRestore"
      @discard="handleDiscard"
    />

    <AboutModal v-if="showAbout" @close="showAbout = false" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--bg-primary);
}

.app-header {
  flex-shrink: 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  --ore-navbar-background: var(--bg-secondary);
  --ore-navbar-bottom-shadow: var(--bg-secondary);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.about-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  min-height: auto;
  min-width: auto;
  width: 36px;
  height: 30px;
}

.about-icon {
  display: flex;
  width: 14px;
  height: 14px;
}

.menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  padding: 3px;
  min-height: auto;
  min-width: auto;
  width: 36px;
  height: 30px;
}

.menu-icon {
  display: flex;
  width: 14px;
  height: 14px;
}

.app-title-icon {
  height: 32px;
  width: auto;
  display: block;
  user-select: none;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.sidebar {
  width: 320px;
  flex-shrink: 0;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-overlay {
  display: none;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 800px;
  max-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 平板端：600px ~ 1024px，抽屉式侧边栏 */
@media (max-width: 1024px) and (min-width: 600px) {
  .menu-toggle {
    display: inline-flex;
  }

  .app-title-icon {
    height: 28px;
  }

  .sidebar {
    position: fixed;
    top: 56px;
    left: 0;
    bottom: 0;
    width: 350px;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    border-right: 1px solid var(--border-color);
    border-top: none;
    overflow: hidden;
    min-height: 0;
  }

  .sidebar :deep(.skin-controls) {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    top: 56px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }

  .main-content {
    padding: 16px;
    min-height: 0;
  }

  .canvas-container {
    /* 用明确的视口高度替代 height:100%，避免 WebKit 下对居中/内边距 flex 父级的百分比高度解析不稳，
       导致模型区超高、底部按钮与角度信息被裁掉 */
    height: min(800px, calc(100dvh - 88px));
    max-height: none;
  }
}

/* 手机端：<600px，上下布局 */
@media (max-width: 599px) {
  .app-header {
    height: 48px;
    padding: 0 12px;
  }

  .app-title-icon {
    height: 24px;
  }

  .app-body {
    flex-direction: column;
  }

  .main-content {
    flex: none;
    height: 45vh;
    min-height: 0;
    padding: 0;
    order: -1;
  }

  .canvas-container {
    max-width: 100%;
    height: 100%;
  }

  .sidebar {
    width: 100%;
    height: 45vh;
    flex-shrink: 0;
    border-right: none;
    border-top: 1px solid var(--border-color);
    overflow-y: auto;
  }

  .sidebar :deep(.skin-controls) {
    max-width: 480px;
    margin: 0 auto;
    padding: 16px;
  }
}
</style>