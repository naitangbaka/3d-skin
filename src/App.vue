<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Navbar, Button } from '@oreui-web/vue';
import SkinCanvas from '@/components/skin-renderer/SkinCanvas.vue';
import SkinControls from '@/components/skin-renderer/SkinControls.vue';
import CameraButton from '@/components/skin-renderer/CameraButton.vue';
import RestoreConfirmModal from '@/components/RestoreConfirmModal.vue';
import { useSkinStore } from '@/stores/skinStore';
import { hasCache, loadCache, saveCache, clearCache } from '@/utils/cache';

const store = useSkinStore();
const showRestore = ref(false);
const showControls = ref(false);

onMounted(() => {
  if (hasCache()) {
    showRestore.value = true;
  }
});

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
        >
          <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>
        <span class="app-title">3D-SKIN</span>
      </div>
    </Navbar>

    <div class="app-body">
      <aside class="sidebar" :class="{ 'sidebar-open': showControls }">
        <div class="sidebar-header">
          <span class="sidebar-title">控制面板</span>
          <Button class="sidebar-close" variant="secondary" size="small" @click="showControls = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>
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
  padding: 0 16px;
  --ore-navbar-background: var(--bg-secondary);
  --ore-navbar-bottom-shadow: var(--bg-secondary);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-toggle {
  display: none;
  padding: 6px;
  min-height: auto;
}

.menu-icon {
  width: 20px;
  height: 20px;
}

.app-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 3px;
  color: #52A535;
  text-shadow:
    0 0 12px rgba(82, 165, 53, 0.25),
    1px 1px 0 rgba(0, 0, 0, 0.4);
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

.sidebar-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.sidebar-close {
  padding: 4px;
  min-height: auto;
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

  .app-title {
    font-size: 20px;
    letter-spacing: 2px;
  }

  .sidebar {
    position: fixed;
    top: 56px;
    left: 0;
    bottom: 0;
    width: 300px;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    border-right: 1px solid var(--border-color);
    border-top: none;
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .sidebar-header {
    display: flex;
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
  }
}

/* 手机端：<600px，上下布局 */
@media (max-width: 599px) {
  .app-header {
    height: 48px;
    padding: 0 12px;
  }

  .app-title {
    font-size: 18px;
    letter-spacing: 2px;
  }

  .app-body {
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    min-height: 0;
    padding: 0;
    order: -1;
  }

  .canvas-container {
    max-width: 100%;
    max-height: 100%;
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