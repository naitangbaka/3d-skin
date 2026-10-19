<script setup lang="ts">
import { ref } from 'vue';
import { Modal, Button } from '@oreui-web/vue';
import { getLicenseEntries } from '@/utils/licenses';

const emit = defineEmits<{
  close: [];
}>();

const showLicenses = ref(false);
const isOpen = ref(true);
const expandedLicense = ref<string | null>(null);

const licenses = getLicenseEntries();

function toggleLicense(name: string) {
  expandedLicense.value = expandedLicense.value === name ? null : name;
}

function handleClose(event?: CustomEvent) {
  if (event?.detail?.reason === 'close') return;
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
          title="关闭关于窗口"
        >
          <svg class="about-close-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </Button>
        <template v-if="showLicenses">
          <div class="about-header">
            <h2 class="about-title">开源库许可证</h2>
          </div>
          <p class="license-note">本项目基于以下开源软件构建，遵循各自的开源许可协议。点击某一项可展开查看该库的完整许可声明。</p>
          <div class="license-scroll">
            <div class="license-accordion">
              <div
                v-for="item in licenses"
                :key="item.name"
                class="license-item"
                :class="{ 'is-expanded': expandedLicense === item.name }"
              >
                <button
                  class="license-item-header"
                  type="button"
                  :aria-expanded="expandedLicense === item.name"
                  :aria-controls="`license-panel-${item.name}`"
                  @click="toggleLicense(item.name)"
                >
                  <span class="license-name">{{ item.name }}</span>
                  <span class="license-version">{{ item.version }}</span>
                  <span class="license-type">{{ item.license }}</span>
                  <svg class="license-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
                <div
                  :id="`license-panel-${item.name}`"
                  class="license-item-body"
                  :class="{ 'is-open': expandedLicense === item.name }"
                >
                  <pre class="license-text-block-long">{{ item.licenseText }}</pre>
                </div>
              </div>
            </div>
          </div>

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
  display: flex;
  flex-direction: column;
  padding: 24px;
  max-height: 70vh;
}

.license-scroll {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
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

.license-note {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 16px;
}

.license-accordion {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.license-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  overflow: hidden;
}

.license-item-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  text-align: left;
  font-size: 14px;
}

.license-item-header:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: -2px;
}

.license-name {
  font-weight: 600;
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

.license-chevron {
  flex-shrink: 0;
  color: var(--text-tertiary);
  transition: transform 0.2s ease-out;
}

.license-item.is-expanded .license-chevron {
  transform: rotate(180deg);
}

.license-item-body {
  display: none;
}

.license-item-body.is-open {
  display: block;
}

.license-text-block-long {
  margin: 12px 16px 16px;
  padding: 12px 16px;
  max-height: 240px;
  overflow: auto;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}
</style>