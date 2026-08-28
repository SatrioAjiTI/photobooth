import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';
import { fileURLToPath } from 'url';

dotenv.config();

import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// HTTPS Agent with disabled keepAlive to prevent socket reuse ECONNRESET errors
const httpsAgent = new https.Agent({
  keepAlive: false,
  timeout: 90000
});

// Helper: Fetch with auto-retry for transient network drops / ECONNRESET
async function fetchWithRetry(requestFn, maxRetries = 3, delayMs = 1500) {
  let lastError = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (err) {
      lastError = err;
      const isTransient = err.code === 'ECONNRESET' || 
                          err.code === 'ETIMEDOUT' || 
                          err.code === 'ECONNABORTED' ||
                          err.message?.includes('socket') || 
                          err.message?.includes('timeout') ||
                          (err.response && err.response.status >= 500);
      
      if (attempt < maxRetries && isTransient) {
        console.warn(`⚠️ Transient network issue (${err.code || err.message}). Retrying attempt ${attempt + 1}/${maxRetries} in ${delayMs}ms...`);
        await new Promise(r => setTimeout(r, delayMs * attempt));
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

const isVercel = !!process.env.VERCEL;
const baseDir = isVercel ? '/tmp' : __dirname;
const dataDir = path.join(baseDir, 'data');
const uploadsDir = path.join(baseDir, 'uploads');

try {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
  console.warn('Directory check:', e.message);
}

const guestsFilePath = path.join(dataDir, 'guests.json');
const questionnairesFilePath = path.join(dataDir, 'questionnaires.json');
const modelUsageFilePath = path.join(dataDir, 'model_usage.json');

const SUPPORTED_MODELS = {
  'bytedance/seedream-5-lite': {
    id: 'bytedance/seedream-5-lite',
    name: 'ByteDance SeaDream 5 Lite',
    provider: 'ByteDance',
    icon: '🌊',
    shortName: 'SeaDream 5 Lite',
    description: 'Multi-Modal 2K Image-to-Image Instruction Model, sangat presisi menjaga muka & pose.',
    count: 0,
    lastUsed: null
  },
  'google/nano-banana-2-lite': {
    id: 'google/nano-banana-2-lite',
    name: 'Google Nano Banana 2 Lite',
    provider: 'Google',
    icon: '🍌',
    shortName: 'Nano Banana 2',
    description: 'Ultra-Fast Lightweight Multi-Modal Diffusion Model dengan latensi rendah.',
    count: 0,
    lastUsed: null
  },
  'stability-ai/stable-diffusion-inpainting': {
    id: 'stability-ai/stable-diffusion-inpainting',
    name: 'Stability AI SD Inpainting',
    provider: 'Stability AI',
    icon: '🎨',
    shortName: 'SD Inpainting',
    description: 'Model inpainting & background replacement dengan kontrol komposisi kuat.',
    count: 0,
    lastUsed: null
  },
  'ideogram-ai/ideogram-v2-turbo': {
    id: 'ideogram-ai/ideogram-v2-turbo',
    name: 'Ideogram AI v2 Turbo',
    provider: 'Ideogram AI',
    icon: '⚡',
    shortName: 'Ideogram v2 Turbo',
    description: 'State-of-the-art visual generator dengan rendering tekstur & gaya photorealistic.',
    count: 0,
    lastUsed: null
  }
};

// In-memory fallbacks to guarantee 100% uptime on ephemeral serverless platforms
let memoryGuests = [];
let memoryQuestionnaires = [];
let memoryModelUsage = { ...SUPPORTED_MODELS };

function initDataFile(filePath, bundledRelativePath, defaultVal) {
  try {
    if (!fs.existsSync(filePath)) {
      const bundledPath = path.join(__dirname, bundledRelativePath);
      if (fs.existsSync(bundledPath)) {
        const content = fs.readFileSync(bundledPath, 'utf8');
        fs.writeFileSync(filePath, content);
        return JSON.parse(content);
      } else {
        fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2));
        return defaultVal;
      }
    } else {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    return defaultVal;
  }
}

memoryGuests = initDataFile(guestsFilePath, 'data/guests.json', []);
memoryQuestionnaires = initDataFile(questionnairesFilePath, 'data/questionnaires.json', []);
memoryModelUsage = initDataFile(modelUsageFilePath, 'data/model_usage.json', SUPPORTED_MODELS);

function getModelUsageData() {
  try {
    if (fs.existsSync(modelUsageFilePath)) {
      const parsed = JSON.parse(fs.readFileSync(modelUsageFilePath, 'utf8'));
      memoryModelUsage = { ...SUPPORTED_MODELS, ...parsed };
      return memoryModelUsage;
    }
  } catch (e) {}
  return memoryModelUsage || { ...SUPPORTED_MODELS };
}

function saveModelUsageData(data) {
  memoryModelUsage = data;
  try {
    fs.writeFileSync(modelUsageFilePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.warn('Notice: using memory storage for model usage');
  }
}

function getLeastUsedModel(usageData) {
  const modelKeys = Object.keys(SUPPORTED_MODELS);
  let leastModel = modelKeys[0];
  let minCount = Infinity;

  for (const key of modelKeys) {
    const count = usageData[key]?.count ?? 0;
    if (count < minCount) {
      minCount = count;
      leastModel = key;
    }
  }
  return leastModel;
}

function recordModelUsage(modelId) {
  const data = getModelUsageData();
  if (!data[modelId]) {
    data[modelId] = {
      id: modelId,
      name: modelId,
      provider: 'AI',
      icon: '🤖',
      shortName: modelId,
      description: 'Model AI',
      count: 0,
      lastUsed: null
    };
  }
  data[modelId].count = (data[modelId].count || 0) + 1;
  data[modelId].lastUsed = new Date().toISOString();
  saveModelUsageData(data);
  return data;
}

function buildReplicateInput(modelId, prompt, uploadedImageUrl, aspect_ratio) {
  const ar = aspect_ratio || '16:9';
  if (modelId === 'bytedance/seedream-5-lite') {
    return {
      size: '2K',
      prompt: prompt,
      max_images: 1,
      image_input: [uploadedImageUrl],
      aspect_ratio: ar,
      output_format: 'png',
      return_byteplus_urls: false,
      sequential_image_generation: 'disabled'
    };
  }
  if (modelId === 'google/nano-banana-2-lite') {
    return {
      prompt: prompt,
      image_input: [uploadedImageUrl],
      image: uploadedImageUrl,
      aspect_ratio: ar
    };
  }
  if (modelId === 'stability-ai/stable-diffusion-inpainting') {
    return {
      prompt: prompt,
      image: uploadedImageUrl,
      init_image: uploadedImageUrl,
      mask: uploadedImageUrl
    };
  }
  if (modelId === 'ideogram-ai/ideogram-v2-turbo') {
    return {
      prompt: prompt,
      image: uploadedImageUrl,
      style_type: 'AUTO',
      aspect_ratio: ar
    };
  }
  return {
    prompt: prompt,
    image_input: [uploadedImageUrl],
    image: uploadedImageUrl,
    aspect_ratio: ar
  };
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
app.use('/uploads', express.static(uploadsDir));

// Helper: Get Local Network IP for QR Code scanning via mobile phone on same Wi-Fi
function getLocalNetworkIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

// ----------------------------------------------------
// 1. SYSTEM & NETWORK INFO
// ----------------------------------------------------
app.get('/api/info', (req, res) => {
  const localIp = getLocalNetworkIp();
  const hasToken = !!process.env.REPLICATE_API_TOKEN;
  res.json({
    status: 'ok',
    localIp,
    port: PORT,
    hasServerToken: hasToken,
    serverTime: new Date().toISOString()
  });
});

// ----------------------------------------------------
// 1.1 MODEL USAGE STATISTICS ENDPOINTS
// ----------------------------------------------------
app.get('/api/models/stats', (req, res) => {
  try {
    const data = getModelUsageData();
    const modelKeys = Object.keys(SUPPORTED_MODELS);
    
    let totalGenerations = 0;
    modelKeys.forEach(k => {
      totalGenerations += (data[k]?.count || 0);
    });

    const leastUsed = getLeastUsedModel(data);

    const modelList = modelKeys.map(k => {
      const item = data[k] || SUPPORTED_MODELS[k];
      const count = item.count || 0;
      const percentage = totalGenerations > 0 ? ((count / totalGenerations) * 100).toFixed(1) : '0.0';
      return {
        ...item,
        percentage: `${percentage}%`,
        isLeastUsed: k === leastUsed
      };
    });

    res.json({
      success: true,
      totalGenerations,
      leastUsedModel: leastUsed,
      leastUsedModelName: SUPPORTED_MODELS[leastUsed]?.name || leastUsed,
      models: modelList,
      rawStats: data
    });
  } catch (error) {
    console.error('Model stats error:', error);
    res.status(500).json({ error: 'Gagal memuat statistik penggunaan model.' });
  }
});

app.post('/api/models/reset-stats', (req, res) => {
  try {
    const resetData = {};
    Object.keys(SUPPORTED_MODELS).forEach(k => {
      resetData[k] = {
        ...SUPPORTED_MODELS[k],
        count: 0,
        lastUsed: null
      };
    });
    saveModelUsageData(resetData);
    res.json({
      success: true,
      message: 'Statistik penggunaan model berhasil di-reset ke 0.',
      stats: resetData
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mereset statistik model.' });
  }
});

// Helper: Multi-provider uploader to ensure photo is ALWAYS hosted as public HTTPS URL
async function uploadToReplicateFiles(imageInput, token) {
  if (!imageInput || typeof imageInput !== 'string') return imageInput;
  
  if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
    return imageInput;
  }

  if (imageInput.startsWith('data:image/')) {
    const mimeMatch = imageInput.match(/^data:(image\/\w+);base64,/);
    const contentType = mimeMatch ? mimeMatch[1] : 'image/png';
    const base64Data = imageInput.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const sizeKb = (buffer.length / 1024).toFixed(1);

    console.log(`📤 Hosting photo (${sizeKb} KB) for AI processing...`);

    // 1. Primary: Replicate Files API CDN
    if (token) {
      try {
        const uploadRes = await fetchWithRetry(async () => {
          const formData = new FormData();
          const blob = new Blob([buffer], { type: contentType });
          formData.append('content', blob, 'photobooth_input.png');

          return await axios.post(
            'https://api.replicate.com/v1/files',
            formData,
            {
              headers: {
                'Authorization': `Bearer ${token.trim()}`
              },
              httpsAgent,
              timeout: 35000
            }
          );
        }, 3, 1000);

        if (uploadRes.data?.urls?.get) {
          console.log(`✅ Photo hosted via Replicate Files API: ${uploadRes.data.urls.get}`);
          return uploadRes.data.urls.get;
        }
      } catch (uploadErr) {
        console.warn('⚠️ Replicate /v1/files upload failed, attempting fallback CDN...', uploadErr.message);
      }
    }

    // 2. Secondary Fallback: tmpfiles.org fast direct CDN
    try {
      console.log('🔄 Attempting fallback upload via tmpfiles CDN...');
      const formData = new FormData();
      const blob = new Blob([buffer], { type: contentType });
      formData.append('file', blob, 'photobooth_input.png');

      const tmpRes = await axios.post('https://tmpfiles.org/api/v1/upload', formData, { timeout: 25000 });
      const rawUrl = tmpRes.data?.data?.url;
      if (rawUrl) {
        const directUrl = rawUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        console.log(`✅ Photo hosted via tmpfiles fallback CDN: ${directUrl}`);
        return directUrl;
      }
    } catch (tmpErr) {
      console.warn('⚠️ Fallback tmpfiles upload failed:', tmpErr.message);
    }
  }

  return imageInput;
}

// ----------------------------------------------------
// 2. REPLICATE AI GENERATION ENDPOINT (MULTI-MODEL SUPPORT)
// ----------------------------------------------------
app.post('/api/replicate/generate', async (req, res) => {
  try {
    const {
      image, // base64 or url
      prompt,
      model = 'auto',
      aspect_ratio = '1:1',
      apiToken: customToken,
      isDemo = false
    } = req.body;

    const token = customToken || process.env.REPLICATE_API_TOKEN;

    // Resolve target model (Auto Least-Used vs User Selected)
    const usageData = getModelUsageData();
    let targetModel = model;
    let isAutoSelected = false;

    if (!targetModel || targetModel === 'auto') {
      targetModel = getLeastUsedModel(usageData);
      isAutoSelected = true;
      console.log(`🤖 Auto Model Selection: Picked least-used model "${targetModel}" (Current count: ${usageData[targetModel]?.count || 0})`);
    } else {
      console.log(`🎯 User-specified Model Selection: "${targetModel}"`);
    }

    const modelInfo = SUPPORTED_MODELS[targetModel] || { name: targetModel, shortName: targetModel, icon: '🤖' };

    // Check if demo mode or no token available
    if (isDemo || !token) {
      console.log(`⚡ Running in AI Demo / Simulator mode using model: ${targetModel}`);
      
      // Simulate realistic AI generation delay (2s)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Record model usage in stats
      recordModelUsage(targetModel);

      return res.json({
        success: true,
        isDemo: true,
        resultUrl: image,
        prompt,
        usedModel: targetModel,
        usedModelName: modelInfo.name,
        usedModelIcon: modelInfo.icon,
        isAutoSelected,
        message: `Foto berhasil diproses dengan AI Style Simulator (${modelInfo.shortName}).`
      });
    }

    // 1. Upload base64 image to public CDN with auto-retry and multi-provider fallback
    const uploadedImageUrl = await uploadToReplicateFiles(image, token);

    // 2. Live Replicate API Call with model-specific input payload
    console.log(`🚀 Sending prediction request to Replicate (${targetModel}) with prompt: "${prompt}"`);
    console.log(`🖼️ Input Image URL: ${uploadedImageUrl.substring(0, 80)}...`);

    const inputPayload = buildReplicateInput(targetModel, prompt, uploadedImageUrl, aspect_ratio);
    const replicateUrl = `https://api.replicate.com/v1/models/${targetModel}/predictions`;

    const response = await fetchWithRetry(() => {
      return axios.post(
        replicateUrl,
        { input: inputPayload },
        {
          headers: {
            'Authorization': `Bearer ${token.trim()}`,
            'Content-Type': 'application/json'
          },
          httpsAgent,
          timeout: 240000
        }
      );
    }, 3, 2000);

    let prediction = response.data;
    console.log(`Prediction created: ${prediction.id}, Status: ${prediction.status}`);

    // If prediction is still processing, poll for up to 240 seconds
    const startTime = Date.now();
    while (prediction.status === 'starting' || prediction.status === 'processing') {
      if (Date.now() - startTime > 240000) {
        throw new Error('AI Generation timed out after 240 seconds.');
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const pollRes = await fetchWithRetry(() => {
          return axios.get(
            `https://api.replicate.com/v1/predictions/${prediction.id}`,
            {
              headers: {
                'Authorization': `Bearer ${token.trim()}`
              },
              httpsAgent,
              timeout: 25000
            }
          );
        }, 3, 1000);

        prediction = pollRes.data;
        console.log(`Polling prediction ${prediction.id}: ${prediction.status}`);
      } catch (pollErr) {
        console.warn(`Polling minor network blip (${pollErr.message}), continuing polling...`);
      }
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(prediction.error || 'Replicate AI processing failed.');
    }

    console.log('📦 Raw prediction.output:', JSON.stringify(prediction.output));

    // Get output URL from Replicate
    let rawResultUrl = '';
    if (Array.isArray(prediction.output) && prediction.output.length > 0) {
      const item = prediction.output[0];
      rawResultUrl = typeof item === 'string' ? item : (item.url || item.href || String(item));
    } else if (typeof prediction.output === 'string') {
      rawResultUrl = prediction.output;
    } else if (prediction.output && typeof prediction.output === 'object') {
      rawResultUrl = prediction.output.url || prediction.output.href || '';
    }

    if (!rawResultUrl) {
      throw new Error('Replicate selesai namun URL gambar hasil tidak ditemukan.');
    }

    // 3. Download image and convert to Base64 data URL for 100% instant rendering with zero 404s
    let finalResultUrl = rawResultUrl;
    let localFileUrl = '';
    try {
      console.log(`📥 Downloading result image from Replicate CDN: ${rawResultUrl}`);
      const imgRes = await fetchWithRetry(() => {
        return axios.get(rawResultUrl, {
          responseType: 'arraybuffer',
          httpsAgent,
          timeout: 45000
        });
      }, 3, 1500);

      const buffer = Buffer.from(imgRes.data);
      const base64DataUrl = `data:image/png;base64,${buffer.toString('base64')}`;
      
      const localFilename = `ai_gen_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.png`;
      const localFilePath = path.join(uploadsDir, localFilename);
      fs.writeFileSync(localFilePath, buffer);
      localFileUrl = `/uploads/${localFilename}`;

      // Return Base64 data URL so browser renders image instantly without external network calls
      finalResultUrl = base64DataUrl;
      console.log(`💾 Saved AI result locally: ${localFileUrl} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (dlErr) {
      console.warn('⚠️ Could not download image buffer, using direct Replicate CDN URL:', dlErr.message);
      finalResultUrl = rawResultUrl;
    }

    // 4. Record model usage in persistent statistics
    recordModelUsage(targetModel);

    res.json({
      success: true,
      predictionId: prediction.id,
      resultUrl: finalResultUrl,
      localUrl: localFileUrl,
      rawCdnUrl: rawResultUrl,
      usedModel: targetModel,
      usedModelName: modelInfo.name,
      usedModelIcon: modelInfo.icon,
      isAutoSelected,
      isDemo: false,
      prompt: prompt
    });

  } catch (error) {
    console.error('Replicate API Error:', error.response?.data || error.message);
    const errorDetail = error.response?.data?.detail || error.response?.data?.error || error.message || 'Gagal memproses gambar dengan AI';
    res.status(500).json({
      success: false,
      error: errorDetail
    });
  }
});

// ----------------------------------------------------
// 3. PHOTO STORAGE & QR CODE MOBILE DOWNLOAD ENDPOINTS
// ----------------------------------------------------
app.post('/api/photos/save', (req, res) => {
  try {
    const { imageBase64, frameType, guestName, prodiId, prodiName } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const photoId = 'photo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `${photoId}.png`;
    const filePath = path.join(uploadsDir, filename);

    try {
      fs.writeFileSync(filePath, buffer);
    } catch (fsErr) {
      console.warn('Notice: Failed writing photo to disk:', fsErr.message);
    }

    const isVercel = !!process.env.VERCEL;
    let baseUrl;
    if (isVercel || req.headers['x-forwarded-host'] || req.headers.host) {
      const protocol = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
      const host = req.headers['x-forwarded-host'] || req.headers.host;
      baseUrl = `${protocol}://${host}`;
    } else {
      const localIp = getLocalNetworkIp();
      baseUrl = `http://${localIp}:${PORT}`;
    }

    const downloadUrl = `${baseUrl}/download/${photoId}`;
    const directImageUrl = `${baseUrl}/uploads/${filename}`;

    res.json({
      success: true,
      photoId,
      filename,
      downloadUrl,
      directImageUrl,
      prodiId: prodiId || 'informatika',
      prodiName: prodiName || 'Teknik Informatika'
    });
  } catch (error) {
    console.error('Save photo error:', error);
    res.status(500).json({ error: 'Failed to save photo' });
  }
});

// Mobile Download Landing Page (Opened when guest scans QR code)
app.get('/download/:id', (req, res) => {
  const photoId = req.params.id;
  const filename = `${photoId}.png`;
  const filePath = path.join(uploadsDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Foto Tidak Ditemukan</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #090d16; color: #f8fafc; text-align: center; padding: 60px 20px; }
          .card { background: #1e293b; padding: 30px; border-radius: 20px; max-width: 420px; margin: 0 auto; border: 1px solid #334155; }
          h2 { color: #f87171; margin-bottom: 12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>⚠️ Foto Tidak Ditemukan</h2>
          <p>Foto mungkin telah dipindahkan atau belum disimpan.</p>
        </div>
      </body>
      </html>
    `);
  }

  const imageUrl = `/uploads/${filename}`;

  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Warta Kampus • Unduh Foto Koran Anda</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(145deg, #090d16 0%, #0f172a 50%, #0c101d 100%);
          color: #f8fafc;
          min-height: 100vh;
          padding: 24px 16px 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .container {
          max-width: 480px;
          width: 100%;
          text-align: center;
        }
        .top-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          border: 1px solid rgba(99, 102, 241, 0.3);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        h1.page-title {
          font-size: 24px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 6px;
        }
        p.subtitle {
          color: #94a3b8;
          font-size: 13px;
          margin-bottom: 20px;
        }
        .photo-card {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 10px;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 25px rgba(99, 102, 241, 0.2);
          margin-bottom: 20px;
        }
        .photo-card img {
          width: 100%;
          height: auto;
          border-radius: 12px;
          display: block;
        }
        .btn-download {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-family: inherit;
          font-size: 16px;
          font-weight: 700;
          padding: 16px 24px;
          border-radius: 14px;
          text-decoration: none;
          box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.5);
          border: none;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          margin-bottom: 16px;
        }
        .btn-download:active {
          transform: scale(0.98);
        }
        .photo-tip {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 24px;
          line-height: 1.4;
        }
        .info-card {
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          text-align: left;
          margin-bottom: 20px;
        }
        .info-card h4 {
          font-size: 14px;
          color: #34d399;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .info-card p {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
        }
        .footer {
          font-size: 12px;
          color: #475569;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="top-badge">📰 WARTA KAMPUS PHOTOBOOTH</div>
        <h1 class="page-title">Foto Koran Anda Sudah Siap!</h1>
        <p class="subtitle">Edisi Eksklusif Berita & Peminatan Program Studi</p>
        
        <div class="photo-card">
          <img src="${imageUrl}" alt="AI Photobooth Newspaper" id="mainPhoto" />
        </div>

        <a href="${imageUrl}" download="Warta-Kampus-${photoId}.png" class="btn-download">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Unduh Foto Koran Kualitas Tinggi (.PNG)
        </a>

        <p class="photo-tip">💡 <em>Tips iPhone & Android:</em> Anda juga dapat menahan foto (tekan lama) lalu pilih <strong>"Simpan Gambar"</strong> ke galeri ponsel.</p>

        <div class="info-card">
          <h4>✅ Kuesioner Berhasil Direkam</h4>
          <p>Terima kasih telah berpartisipasi dalam riset evaluasi kualitas AI & Creative Marketing Photobooth Kampus.</p>
        </div>

        <div class="footer">
          Warta Kampus AI Photobooth Experience • Universitas FTI 2026
        </div>
      </div>
    </body>
    </html>
  `);
});

// ----------------------------------------------------
// 4. GUESTBOOK & MANDATORY DATA COLLECTION
// ----------------------------------------------------
function getGuestsList() {
  try {
    if (fs.existsSync(guestsFilePath)) {
      memoryGuests = JSON.parse(fs.readFileSync(guestsFilePath, 'utf8'));
      return memoryGuests;
    }
  } catch (e) {}
  return memoryGuests || [];
}

function saveGuestsList(list) {
  memoryGuests = list;
  try {
    fs.writeFileSync(guestsFilePath, JSON.stringify(list, null, 2));
  } catch (e) {
    console.warn('Notice: Using in-memory guest list');
  }
}

app.post('/api/guests', (req, res) => {
  try {
    const { name, age, gender, phone, email, rating, feedback, photoId, prodiId, prodiName } = req.body;

    if (!name || !phone || !email || !rating) {
      return res.status(400).json({
        error: 'Nama lengkap, nomor HP, email, dan rating bintang wajib diisi.'
      });
    }

    const guests = getGuestsList();

    const newGuest = {
      id: 'guest_' + Date.now(),
      name: name.trim(),
      age: age ? parseInt(age, 10) : null,
      gender: gender ? gender.trim() : 'Laki-laki',
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      rating: parseInt(rating, 10),
      feedback: feedback ? feedback.trim() : '',
      prodiId: prodiId || 'informatika',
      prodiName: prodiName || 'Teknik Informatika',
      photoId: photoId || null,
      createdAt: new Date().toISOString()
    };

    guests.unshift(newGuest);
    saveGuestsList(guests);

    res.json({
      success: true,
      message: 'Data tamu dan feedback berhasil disimpan!',
      guest: newGuest
    });
  } catch (error) {
    console.error('Save guest error:', error);
    res.status(500).json({ error: 'Gagal menyimpan data tamu.' });
  }
});

app.get('/api/guests', (req, res) => {
  try {
    const guests = getGuestsList();
    
    // Calculate stats
    const total = guests.length;
    const avgRating = total > 0
      ? (guests.reduce((sum, g) => sum + (g.rating || 0), 0) / total).toFixed(1)
      : '5.0';

    const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const prodiCounts = { informatika: 0, manajemen: 0, keperawatan: 0 };

    guests.forEach(g => {
      if (g.rating && starCounts[g.rating] !== undefined) {
        starCounts[g.rating]++;
      }
      if (g.prodiId && prodiCounts[g.prodiId] !== undefined) {
        prodiCounts[g.prodiId]++;
      } else if (g.prodiId) {
        prodiCounts[g.prodiId] = (prodiCounts[g.prodiId] || 0) + 1;
      }
    });

    res.json({
      success: true,
      total,
      avgRating,
      starCounts,
      prodiCounts,
      guests
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data tamu.' });
  }
});

app.get('/api/guests/export', (req, res) => {
  try {
    const guests = getGuestsList();
    
    let csv = 'ID,Waktu,Nama Lengkap,Umur,Jenis Kelamin,Nomor HP,Email,Peminatan Prodi,Rating Bintang,Komentar & Saran,Photo ID\n';
    guests.forEach(g => {
      const row = [
        `"${g.id}"`,
        `"${g.createdAt}"`,
        `"${(g.name || '').replace(/"/g, '""')}"`,
        `"${g.age || ''}"`,
        `"${(g.gender || '').replace(/"/g, '""')}"`,
        `"${(g.phone || '').replace(/"/g, '""')}"`,
        `"${(g.email || '').replace(/"/g, '""')}"`,
        `"${(g.prodiName || g.prodiId || '').replace(/"/g, '""')}"`,
        `"${g.rating}"`,
        `"${(g.feedback || '').replace(/"/g, '""')}"`,
        `"${g.photoId || ''}"`
      ];
      csv += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="ai-photobooth-guests-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengekspor CSV.' });
  }
});

// ----------------------------------------------------
// 5. QUESTIONNAIRE RESPONSES & ANALYTICS ENDPOINTS
// ----------------------------------------------------
function getQuestionnairesList() {
  try {
    if (fs.existsSync(questionnairesFilePath)) {
      memoryQuestionnaires = JSON.parse(fs.readFileSync(questionnairesFilePath, 'utf8'));
      return memoryQuestionnaires;
    }
  } catch (e) {}
  return memoryQuestionnaires || [];
}

function saveQuestionnairesList(list) {
  memoryQuestionnaires = list;
  try {
    fs.writeFileSync(questionnairesFilePath, JSON.stringify(list, null, 2));
  } catch (e) {
    console.warn('Notice: Using in-memory questionnaires list');
  }
}

app.post('/api/questionnaires', (req, res) => {
  try {
    const {
      photoId,
      q1_face,
      q2_pose,
      q3_keyword,
      q4_marketing,
      q5_brochure_preference,
      respondentName
    } = req.body;

    const list = getQuestionnairesList();

    const newResponse = {
      id: 'resp_' + Date.now(),
      photoId: photoId || null,
      respondentName: respondentName || 'Responden Photobooth',
      q1_face: parseInt(q1_face || 5, 10),
      q2_pose: parseInt(q2_pose || 5, 10),
      q3_keyword: parseInt(q3_keyword || 5, 10),
      q4_marketing: parseInt(q4_marketing || 5, 10),
      q5_brochure_preference: q5_brochure_preference || 'brosur_kreatif',
      createdAt: new Date().toISOString()
    };

    list.unshift(newResponse);
    saveQuestionnairesList(list);

    console.log(`📋 New Questionnaire Response recorded for photo: ${photoId} (Pref: ${newResponse.q5_brochure_preference})`);

    res.json({
      success: true,
      message: 'Kuesioner responden berhasil disimpan!',
      response: newResponse
    });
  } catch (error) {
    console.error('Save questionnaire error:', error);
    res.status(500).json({ error: 'Gagal menyimpan kuesioner.' });
  }
});

app.get('/api/questionnaires', (req, res) => {
  try {
    const list = getQuestionnairesList();
    const total = list.length;

    let avgFace = '5.0';
    let avgPose = '5.0';
    let avgKeyword = '5.0';
    let avgMarketing = '5.0';
    let preferenceCounts = { brosur_kreatif: 0, brosur_fisik: 0 };

    if (total > 0) {
      avgFace = (list.reduce((s, r) => s + (r.q1_face || 5), 0) / total).toFixed(2);
      avgPose = (list.reduce((s, r) => s + (r.q2_pose || 5), 0) / total).toFixed(2);
      avgKeyword = (list.reduce((s, r) => s + (r.q3_keyword || 5), 0) / total).toFixed(2);
      avgMarketing = (list.reduce((s, r) => s + (r.q4_marketing || 5), 0) / total).toFixed(2);

      list.forEach(r => {
        if (r.q5_brochure_preference === 'brosur_fisik') {
          preferenceCounts.brosur_fisik++;
        } else {
          preferenceCounts.brosur_kreatif++;
        }
      });
    }

    const percentageKreatif = total > 0 ? ((preferenceCounts.brosur_kreatif / total) * 100).toFixed(1) : '100.0';

    res.json({
      success: true,
      total,
      stats: {
        avgFace,
        avgPose,
        avgKeyword,
        avgMarketing,
        preferenceCounts,
        percentageKreatif
      },
      responses: list
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data kuesioner.' });
  }
});

app.get('/api/questionnaires/export', (req, res) => {
  try {
    const list = getQuestionnairesList();
    
    let csv = 'ID,Waktu,Photo ID,Q1_Kemiripan_Wajah(1-5),Q2_Kemiripan_Pose(1-5),Q3_Kesesuaian_Keyword(1-5),Q4_Keseruan_Marketing(1-5),Q5_Preferensi_Brosur\n';
    list.forEach(r => {
      const row = [
        `"${r.id}"`,
        `"${r.createdAt}"`,
        `"${r.photoId || ''}"`,
        `"${r.q1_face}"`,
        `"${r.q2_pose}"`,
        `"${r.q3_keyword}"`,
        `"${r.q4_marketing}"`,
        `"${r.q5_brochure_preference === 'brosur_kreatif' ? 'Brosur Kreatif (AI Photobooth)' : 'Brosur Fisik Konvensional'}"`
      ];
      csv += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="ai-photobooth-questionnaires-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengekspor CSV kuesioner.' });
  }
});

// Export Express app for Vercel Serverless Functions
export default app;

// Start Server locally if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalNetworkIp();
    console.log(`\n======================================================`);
    console.log(`📸 AI Photobooth Server running on port ${PORT}`);
    console.log(`🌐 Local API:   http://localhost:${PORT}`);
    console.log(`📱 LAN Network: http://${localIp}:${PORT}`);
    console.log(`======================================================\n`);
  });
}
