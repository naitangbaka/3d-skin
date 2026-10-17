<script setup lang="ts">
import { ref } from 'vue';
import { Modal, Button } from '@oreui-web/vue';

const emit = defineEmits<{
  restore: [];
  discard: [];
}>();

const isOpen = ref(true);

function handleRestore() {
  isOpen.value = false;
  emit('restore');
}

function handleDiscard() {
  isOpen.value = false;
  emit('discard');
}

function handleClose(event: CustomEvent) {
  if (event.detail?.reason !== 'close') {
    isOpen.value = false;
    emit('discard');
  }
}
</script>

<template>
  <Modal
    :open="isOpen"
    @modal-close="handleClose"
  >
    <dialog class="ore-modal-dialog">
      <div class="ore-modal-content">
        <div class="ore-modal-header">
          <h2 class="ore-modal-title">恢复会话</h2>
        </div>
        <p class="ore-modal-description restore-desc">
          检测到上次未完成的编辑内容，是否恢复？
        </p>
        <div class="restore-actions">
          <Button color="secondary" class="ore-modal-close" @click="handleDiscard">放弃</Button>
          <Button @click="handleRestore">恢复</Button>
        </div>
      </div>
    </dialog>
  </Modal>
</template>

<style>
.ore-modal-dialog {
  margin: auto;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  min-width: 360px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

@media (max-width: 768px) {
  .ore-modal-dialog {
    min-width: 0;
    width: 90vw;
    max-width: 90vw;
  }
}

.ore-modal-dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}
</style>

<style scoped>
.ore-modal-content {
  padding: 24px;
}

.ore-modal-header {
  margin-bottom: 16px;
}

.ore-modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  background: none;
  padding: 0 0 0 8px;
  line-height: 1.4;
  white-space: nowrap;
}

.ore-modal-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  text-decoration: none;
  margin: 0;
}

.restore-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.restore-actions :deep(button) {
  min-width: 80px;
  padding: 8px 20px;
  font-size: 14px;
}
</style>