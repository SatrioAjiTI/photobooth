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
    tag: 'Presisi Wajah 2K'
  },
  {
    id: 'google/nano-banana-2-lite',
    name: 'Google Nano Banana 2 Lite',
    provider: 'Google',
    icon: '🍌',
    shortName: 'Nano Banana 2 Lite',
    description: 'Ultra-Fast Lightweight Multi-Modal Diffusion Model dengan latensi rendah dan hasil cepat.',
    tag: 'Ultra Cepat'
  },
  {
    id: 'bytedance/seedream-5-pro',
    name: 'ByteDance SeaDream 5.0 Pro',
    provider: 'ByteDance',
    icon: '✨',
    shortName: 'SeaDream 5.0 Pro',
    description: 'Flagship Multi-Reference Image Model dengan resolusi ultra-tajam dan konsistensi tinggi.',
    tag: 'Flagship 2K Pro'
  },
  {
    id: 'google/nano-banana-2',
    name: 'Google Nano Banana 2 (Standard)',
    provider: 'Google',
    icon: '⚡',
    shortName: 'Nano Banana 2 HD',
    description: 'High-Quality Gemini Vision Image Generator dengan kontrol visual dan detail lebih kaya.',
    tag: 'High Detail'
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
