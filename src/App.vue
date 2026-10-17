<script setup lang="ts">
import { Navbar } from '@oreui-web/vue';
import SkinCanvas from '@/components/skin-renderer/SkinCanvas.vue';
import SkinControls from '@/components/skin-renderer/SkinControls.vue';
import CameraButton from '@/components/skin-renderer/CameraButton.vue';
</script>

<template>
  <div class="app-container">
    <Navbar class="app-header">
      <span class="app-title">3D-SKIN</span>
    </Navbar>

    <div class="app-body">
      <aside class="sidebar">
        <SkinControls />
      </aside>

      <main class="main-content">
        <div class="canvas-container">
          <SkinCanvas />
          <CameraButton />
        </div>
      </main>
    </div>
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
}

.sidebar {
  width: 320px;
  flex-shrink: 0;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
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
}
</style>