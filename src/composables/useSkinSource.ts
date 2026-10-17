import { ref } from 'vue';
import { useSkinStore } from '@/stores/skinStore';
import { SkinSourceType } from '@/types';
import { getSkinUrlByUsername } from '@/utils/mojangApi';

export function useSkinSource() {
  const store = useSkinStore();
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function uploadSkin(file: File): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('请上传图片文件');
      }

      const reader = new FileReader();
      const imageUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsDataURL(file);
      });

      store.setSkin({
        id: crypto.randomUUID(),
        sourceType: SkinSourceType.UPLOAD,
        imageUrl,
        originalName: file.name
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : '上传失败';
    } finally {
      loading.value = false;
    }
  }

  async function fetchSkinByUsername(username: string): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const skinUrl = await getSkinUrlByUsername(username.trim());
      if (!skinUrl) {
        throw new Error('未找到该玩家的皮肤');
      }

      store.setSkin({
        id: crypto.randomUUID(),
        sourceType: SkinSourceType.API,
        imageUrl: skinUrl,
        playerName: username.trim()
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取皮肤失败';
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    uploadSkin,
    fetchSkinByUsername
  };
}