import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue';
import { use, createSkinViewer } from '@daidr/minecraft-skin-renderer';
import { WebGLRendererPlugin } from '@daidr/minecraft-skin-renderer/webgl';
import type { SkinViewer } from '@daidr/minecraft-skin-renderer';
import { useSkinStore } from '@/stores/skinStore';
import { getDefaultGraySkin } from '@/utils/defaultSkin';

let pluginRegistered = false;

// 缩放基准：scale=1 时对应 zoom=BASE_ZOOM，二者互为倒数关系
const BASE_ZOOM = 60;
// 渲染器端 zoom 限位，确保缩放极值不会失控
const ZOOM_MAX = 150; // scale 0.4
const ZOOM_MIN = 20;  // scale 3.0

export function useSkinRenderer(canvasRef: Ref<HTMLCanvasElement | null>) {
  const viewer = ref<SkinViewer | null>(null);
  const store = useSkinStore();
  const isReady = ref(false);
  const theta = ref(0);
  const phi = ref(0);

  onMounted(async () => {
    if (!canvasRef.value) return;

    if (!pluginRegistered) {
      use(WebGLRendererPlugin);
      pluginRegistered = true;
    }

    const canvas = canvasRef.value;
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    }

    const v = await createSkinViewer({
      canvas: canvas,
      preferredBackend: 'auto',
      antialias: true,
      pixelRatio: window.devicePixelRatio,
      enableRotate: true,
      enableZoom: true,
      autoRotate: false,
      fov: 70,
      zoom: 60
    });

    viewer.value = v;
    isReady.value = true;

    v.onRotationChange = (t: number, p: number) => {
      theta.value = t;
      phi.value = p;
    };

    v.onZoomChange = (zoom: number) => {
      if (zoom > ZOOM_MAX) { v.setZoom(ZOOM_MAX); return; }
      if (zoom < ZOOM_MIN) { v.setZoom(ZOOM_MIN); return; }
      store.updateEffects({ scale: BASE_ZOOM / zoom });
    };

    const initialRotation = v.getRotation();
    theta.value = initialRotation.theta;
    phi.value = initialRotation.phi;

    v.startRenderLoop();

    if (store.skin?.imageUrl) {
      await v.setSkin(store.skin.imageUrl);
    } else {
      await v.setSkin(getDefaultGraySkin());
    }
  });

  onUnmounted(() => {
    viewer.value?.stopRenderLoop();
    viewer.value?.dispose();
    viewer.value = null;
    isReady.value = false;
  });

  watch(() => store.skin, async (newSkin) => {
    if (viewer.value && newSkin?.imageUrl) {
      await viewer.value.setSkin(newSkin.imageUrl);
    } else if (viewer.value) {
      await viewer.value.setSkin(getDefaultGraySkin());
    }
  });

  watch(() => store.effects.slim, (slim) => {
    viewer.value?.setSlim(slim);
  });

  watch(() => store.effects.scale, (scale) => {
    const v = viewer.value;
    if (!v) return;
    v.setZoom(BASE_ZOOM / scale);
  });

  function takeScreenshot(type: 'png' | 'jpeg' = 'png', quality?: number): string {
    return viewer.value?.screenshot(type, quality) ?? '';
  }

  function resetCamera() {
    viewer.value?.resetCamera();
    store.updateEffects({ scale: 1 });
    const rot = viewer.value?.getRotation();
    if (rot) {
      theta.value = rot.theta;
      phi.value = rot.phi;
    }
  }

  function setRotation(t: number, p: number) {
    viewer.value?.setRotation(t, p);
    theta.value = t;
    phi.value = p;
  }

  return {
    viewer,
    isReady,
    theta,
    phi,
    takeScreenshot,
    resetCamera,
    setRotation
  };
}