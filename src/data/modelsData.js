// ==========================================================================
// AI MODEL DEFINITIONS & CONFIGURATION
// ==========================================================================

export const AVAILABLE_MODELS = [
  {
    id: 'bytedance/seedream-5-lite',
    name: 'ByteDance SeaDream 5 Lite',
    provider: 'ByteDance',
    icon: '🌊',
    shortName: 'SeaDream 5 Lite',
    description: 'Multi-Modal 2K Image-to-Image Instruction Model, sangat presisi menjaga muka & pose asli.',
    tag: 'Presisi Wajah'
  },
  {
    id: 'google/nano-banana-2-lite',
    name: 'Google Nano Banana 2 Lite',
    provider: 'Google',
    icon: '🍌',
    shortName: 'Nano Banana 2',
    description: 'Ultra-Fast Lightweight Multi-Modal Diffusion Model dengan latensi rendah dan hasil cepat.',
    tag: 'Ultra Cepat'
  },
  {
    id: 'stability-ai/stable-diffusion-inpainting',
    name: 'Stability AI SD Inpainting',
    provider: 'Stability AI',
    icon: '🎨',
    shortName: 'SD Inpainting',
    description: 'Model inpainting & background replacement dengan kontrol komposisi latar kuat.',
    tag: 'Inpainting'
  },
  {
    id: 'ideogram-ai/ideogram-v2-turbo',
    name: 'Ideogram AI v2 Turbo',
    provider: 'Ideogram AI',
    icon: '⚡',
    shortName: 'Ideogram v2 Turbo',
    description: 'State-of-the-art visual generator dengan rendering tekstur & gaya photorealistic tinggi.',
    tag: 'Photorealistic'
  }
];

export const AUTO_MODEL_ID = 'auto';

export function getModelById(modelId) {
  if (!modelId || modelId === AUTO_MODEL_ID) {
    return {
      id: 'auto',
      name: 'Otomatis (Paling Jarang Dipakai)',
      provider: 'Smart Load Balancer',
      icon: '🤖',
      shortName: 'Auto (Least Used)',
      description: 'Sistem otomatis memilih model yang total pemakaiannya paling sedikit untuk pemerataan kuota.',
      tag: 'Default Rekomendasi'
    };
  }
  return AVAILABLE_MODELS.find(m => m.id === modelId) || AVAILABLE_MODELS[0];
}
