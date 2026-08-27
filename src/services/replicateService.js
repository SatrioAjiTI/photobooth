import axios from 'axios';
import { AVAILABLE_MODELS, AUTO_MODEL_ID, getModelById } from '../data/modelsData.js';

// Local storage keys
const TOKEN_STORAGE_KEY = 'ai_photobooth_replicate_token';
const MODEL_STORAGE_KEY = 'ai_photobooth_selected_model';

export const replicateService = {
  // Get stored API token
  getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  },

  // Save API token
  saveToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  },

  // Get selected model (defaults to 'auto' -> least used model)
  getModel() {
    return localStorage.getItem(MODEL_STORAGE_KEY) || AUTO_MODEL_ID;
  },

  // Save selected model
  saveModel(model) {
    localStorage.setItem(MODEL_STORAGE_KEY, model || AUTO_MODEL_ID);
  },

  // Fetch model usage statistics from backend
  async getModelStats() {
    try {
      const res = await axios.get('/api/models/stats');
      return res.data;
    } catch (e) {
      console.warn('Could not fetch model stats from backend:', e);
      return {
        success: false,
        totalGenerations: 0,
        leastUsedModel: 'bytedance/seedream-5-lite',
        models: AVAILABLE_MODELS.map(m => ({ ...m, count: 0, percentage: '0.0%', isLeastUsed: false }))
      };
    }
  },

  // Reset model usage stats
  async resetModelStats() {
    try {
      const res = await axios.post('/api/models/reset-stats');
      return res.data;
    } catch (e) {
      console.error('Failed to reset model stats:', e);
      throw e;
    }
  },

  // Apply artistic styling simulation on Canvas (Fallback / Demo mode)
  async applyDemoStyling(imageSrc, prompt = '', styleId = 'photorealistic') {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 800;

        // Draw original
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Apply style effects based on prompt keywords & styleId
        const promptLower = prompt.toLowerCase();
        
        ctx.save();
        if (promptLower.includes('cyberpunk') || styleId === 'cyber-hyper' || promptLower.includes('neon')) {
          // Cyberpunk Cyan / Magenta Duotone Overlay
          ctx.globalCompositeOperation = 'screen';
          const cyberGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          cyberGrad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
          cyberGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.3)');
          cyberGrad.addColorStop(1, 'rgba(236, 72, 153, 0.4)');
          ctx.fillStyle = cyberGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Add subtle scanline grid
          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
          for (let y = 0; y < canvas.height; y += 8) {
            ctx.fillRect(0, y, canvas.width, 2);
          }
        } else if (promptLower.includes('gold') || promptLower.includes('royal') || promptLower.includes('sunset')) {
          // Golden hour / Warm Luxury Gala Glow
          ctx.globalCompositeOperation = 'color';
          ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.globalCompositeOperation = 'soft-light';
          const goldGrad = ctx.createRadialGradient(
            canvas.width * 0.5, canvas.height * 0.3, 50,
            canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.7
          );
          goldGrad.addColorStop(0, 'rgba(251, 191, 36, 0.5)');
          goldGrad.addColorStop(1, 'rgba(180, 83, 9, 0.4)');
          ctx.fillStyle = goldGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (promptLower.includes('blossom') || promptLower.includes('pastel') || promptLower.includes('romantic')) {
          // Soft Pink Pastel / Cherry Blossom Aura
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = 'rgba(244, 114, 182, 0.25)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = 'rgba(253, 224, 71, 0.15)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (styleId === 'pixar-3d' || promptLower.includes('pixar') || promptLower.includes('disney')) {
          // Vibrant Saturation & Soft Bloom
          ctx.globalCompositeOperation = 'color-burn';
          ctx.fillStyle = 'rgba(99, 102, 241, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.globalCompositeOperation = 'soft-light';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (styleId === 'ghibli-anime' || promptLower.includes('anime') || promptLower.includes('ghibli')) {
          // Anime Vibrant Tint
          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          // Studio Polish / Contrast Boost
          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Add studio vignette
        ctx.globalCompositeOperation = 'multiply';
        const vignette = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, canvas.width * 0.35,
          canvas.width / 2, canvas.height / 2, canvas.width * 0.75
        );
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.restore();

        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };
      img.src = imageSrc;
    });
  },

  // Generate Image with AI (Replicate API with Multi-Model / Auto Least-Used)
  async generateImage({
    image,
    prompt,
    negative_prompt = '',
    aspect_ratio = '16:9',
    strength = 0.75,
    isDemo = false
  }) {
    const token = this.getToken();
    const model = this.getModel();

    // Call server endpoint
    try {
      const response = await axios.post('/api/replicate/generate', {
        image,
        prompt,
        negative_prompt,
        aspect_ratio,
        model,
        strength,
        apiToken: token,
        isDemo: isDemo || (!token && !window.__SERVER_HAS_TOKEN)
      }, {
        timeout: 300000
      });

      if (response.data.isDemo) {
        // Apply client demo enhancement filter
        const enhancedDemoImage = await this.applyDemoStyling(image, prompt);
        return {
          success: true,
          isDemo: true,
          resultUrl: enhancedDemoImage,
          prompt,
          usedModel: response.data.usedModel,
          usedModelName: response.data.usedModelName,
          note: `Mode AI Simulator Aktif (${response.data.usedModelName || 'Simulator'})`
        };
      }

      if (!response.data.success) {
        throw new Error(response.data.error || 'Gagal memproses gambar di Replicate AI');
      }

      return response.data;
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || 'Koneksi ke Replicate AI gagal';
      
      // If user had actually entered a token, DO NOT silently hide the error
      if (token) {
        console.error('Live Replicate API Error:', errMsg);
        throw new Error(`Replicate API: ${errMsg}`);
      }

      // Only fall back to simulator if NO token was provided at all
      console.warn('Replicate API token belum diisi, menggunakan AI simulator bawaan:', errMsg);
      await new Promise(r => setTimeout(r, 1500));
      const fallbackImage = await this.applyDemoStyling(image, prompt);
      return {
        success: true,
        isDemo: true,
        resultUrl: fallbackImage,
        prompt,
        note: 'Mode Simulator (Belum ada Token Replicate)'
      };
    }
  }
};
