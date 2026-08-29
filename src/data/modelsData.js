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
    id: 'black-forest-labs/flux-2-flex',
    name: 'FLUX.2 Flex (Black Forest Labs)',
    provider: 'Black Forest Labs',
    icon: '⚡',
    shortName: 'FLUX.2 Flex',
    description: 'Generasi gambar tingkat lanjut dengan pemrosesan multi-modal dan kontrol input gambar presisi.',
    tag: 'State-of-the-Art'
  },
  {
    id: 'openai/gpt-5.6-luna',
    name: 'OpenAI GPT-5.6 Luna Vision',
    provider: 'OpenAI',
    icon: '🌙',
    shortName: 'GPT-5.6 Luna',
    description: 'Multi-modal image-to-image neural transformation dengan pemahaman prompt bahasa alami mendalam.',
    tag: 'Vision Multi-Modal'
  },
  {
    id: 'grok-imagine-image-2',
    name: 'xAI Grok Imagine Image 2',
    provider: 'xAI',
    icon: '🚀',
    shortName: 'Grok Imagine 2',
    description: 'Ultra-creative neural renderer dengan style transfer dan rendering visual dinamis.',
    tag: 'Creative Styling'
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
