<script setup lang="ts">
import { ref } from 'vue';
import { Modal, Button } from '@oreui-web/vue';

const emit = defineEmits<{
  close: [];
}>();

const showLicenses = ref(false);
const isOpen = ref(true);

interface LicenseItem {
  name: string;
  version: string;
  license: string;
}

const licenses: LicenseItem[] = [
  { name: 'Vue', version: '3.x', license: 'MIT' },
  { name: 'Pinia', version: '3.x', license: 'MIT' },
  { name: 'OreUI Web', version: '0.0.1', license: 'MIT' },
  { name: '@oreui-web/vue', version: '0.0.1', license: 'MIT' },
  { name: '@iconify-prerendered/vue-pixel', version: '0.28.x', license: 'MIT' },
  { name: '@daidr/minecraft-skin-renderer', version: '0.3.2', license: 'MIT' },
  { name: 'Vite', version: '8.x', license: 'MIT' },
  { name: 'TypeScript', version: '6.x', license: 'Apache-2.0' }
];

function handleClose() {
  isOpen.value = false;
  emit('close');
}
</script>

<template>
  <Modal :open="isOpen" @modal-close="handleClose">
    <dialog class="ore-modal-dialog">
      <div class="ore-modal-content about-content">
        <Button
          class="about-close"
          color="secondary"
          variant="default"
          @click="handleClose"
          aria-label="关闭关于窗口"
        >
          <svg class="about-close-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </Button>
        <template v-if="showLicenses">
          <div class="about-header">
            <h2 class="about-title">开源库许可证</h2>
          </div>
          <ul class="license-list">
            <li v-for="item in licenses" :key="item.name" class="license-item">
              <span class="license-name">{{ item.name }}</span>
              <span class="license-version">{{ item.version }}</span>
              <span class="license-type">{{ item.license }}</span>
            </li>
          </ul>
          <p class="license-note">本项目基于以上开源软件构建，遵循各自的开源许可协议。</p>
          <div class="license-actions">
            <Button
              color="secondary"
              size="small"
              @click="showLicenses = false"
              aria-label="返回项目介绍"
            >
              返回
            </Button>
          </div>
        </template>

        <template v-else>
          <div class="about-header">
            <h2 class="about-title">关于 3D-SKIN</h2>
          </div>
          <p class="about-desc">
            3D-SKIN 是一个在线的 Minecraft 皮肤编辑器，无需安装，直接在浏览器中完成皮肤的预览与编辑。
          </p>
          <ul class="feature-list">
            <li class="feature-item">实时 3D 皮肤预览与视角切换</li>
            <li class="feature-item">多种背景选项，支持纯色与透明</li>
            <li class="feature-item">按玩家名获取并下载官方皮肤</li>
            <li class="feature-item">自动保存编辑进度，恢复编辑会话</li>
          </ul>
          <div class="about-actions">
            <Button @click="showLicenses = true">开源库许可证</Button>
          </div>
        </template>
      </div>
    </dialog>
  </Modal>
</template>

<style scoped>
.about-content {
  position: relative;
  padding: 24px;
}

.about-close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  max-width: 28px;
  min-height: 28px;
  max-height: 28px;
  padding: 0;
  box-sizing: border-box;
}

.about-close :deep(*) {
  padding: 0;
  margin: 0;
}

.about-close-icon {
  display: flex;
  width: 14px;
  height: 14px;
}

.about-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.about-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  background: none;
  padding: 0 32px 0 8px;
  line-height: 1.4;
  white-space: nowrap;
  border-left: 2px solid #52A535;
}

.license-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.about-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0 0 16px;
}

.feature-list {
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  position: relative;
  padding-left: 16px;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
}

.feature-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 6px;
  height: 6px;
  background: #52A535;
}

.about-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.about-actions :deep(ore-button) {
  padding: 8px 20px;
  font-size: 14px;
}

.license-list {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.license-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 4px;
  background: var(--bg-primary);
  font-size: 14px;
}

.license-name {
  font-weight: 600;
  color: var(--text-primary);
}

.license-version {
  color: var(--text-secondary);
  font-size: 13px;
}

.license-type {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #52A535;
  background: rgba(82, 165, 53, 0.12);
}

.license-note {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}
</style>