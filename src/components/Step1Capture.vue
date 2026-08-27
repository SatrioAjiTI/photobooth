<template>
  <div class="step1-container">
    <!-- Header Title -->
    <div class="step-header-text">
      <div class="badge badge-primary">LANGKAH 1 DARI 3</div>
      <h2 class="step-title">Ambil Foto Anda</h2>
      <p class="step-desc">Gunakan kamera langsung untuk sensasi photobooth asli atau unggah foto dari galeri perangkat Anda.</p>
    </div>

    <!-- Mode Selector Tabs (Camera vs Gallery) -->
    <div class="mode-tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'camera' }"
        @click="switchTab('camera')"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        <span>Kamera Langsung</span>
      </button>

      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'upload' }"
        @click="switchTab('upload')"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <span>Unggah Galeri</span>
      </button>
    </div>

    <!-- Main Capture Stage -->
    <div class="stage-wrapper glass-panel">
      <!-- 1. LIVE CAMERA MODE -->
      <div v-if="activeTab === 'camera' && !capturedImage" class="camera-stage">
        <!-- Live Video Viewport -->
        <div class="video-viewport">
          <video 
            ref="videoRef" 
            autoplay 
            playsinline 
            muted 
            class="camera-feed"
            :class="{ mirrored: isFrontCamera }"
          ></video>

          <!-- Camera Grid Overlay -->
          <div class="camera-grid">
            <div class="grid-line vertical line-1"></div>
            <div class="grid-line vertical line-2"></div>
            <div class="grid-line horizontal line-1"></div>
            <div class="grid-line horizontal line-2"></div>
          </div>

          <!-- Countdown Big Overlay -->
          <div v-if="countdown > 0" class="countdown-overlay">
            <div class="countdown-circle">
              <span class="countdown-num">{{ countdown }}</span>
            </div>
            <p class="countdown-tip">Bersiap & Tersenyum! ✨</p>
          </div>

          <!-- Camera Error / Loading fallback -->
          <div v-if="cameraError" class="camera-error-overlay">
            <div class="error-icon">⚠️</div>
            <h3>Kamera Tidak Dapat Diakses</h3>
            <p>{{ cameraError }}</p>
            <button class="btn btn-primary btn-sm" @click="startCamera">
              🔄 Coba Akses Lagi
            </button>
          </div>

          <div v-if="isCameraLoading && !cameraError" class="camera-loading-overlay">
            <div class="spinner"></div>
            <p>Menghubungkan ke kamera...</p>
          </div>
        </div>

        <!-- Camera Controls Toolbar -->
        <div class="camera-toolbar">
          <!-- Timer Selector -->
          <div class="toolbar-group">
            <span class="toolbar-label">⏱️ Timer:</span>
            <div class="timer-chips">
              <button 
                class="timer-chip" 
                :class="{ active: selectedTimer === 0 }" 
                @click="selectedTimer = 0"
              >0s</button>
              <button 
                class="timer-chip" 
                :class="{ active: selectedTimer === 3 }" 
                @click="selectedTimer = 3"
              >3s</button>
              <button 
                class="timer-chip" 
                :class="{ active: selectedTimer === 5 }" 
                @click="selectedTimer = 5"
              >5s</button>
            </div>
          </div>

          <!-- Big Shutter Button -->
          <button 
            class="shutter-button" 
            :disabled="isCameraLoading || !!cameraError || countdown > 0"
            @click="triggerCapture"
            title="Ambil Foto"
          >
            <div class="shutter-inner">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="4" fill="currentColor"/>
              </svg>
            </div>
          </button>

          <!-- Flip Camera -->
          <div class="toolbar-group right-align">
            <button 
              class="btn btn-secondary btn-icon" 
              @click="toggleCameraFacing"
              title="Ganti Kamera Depan / Belakang"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8v4l-3-3 3 3 3-3"/>
                <path d="M4 14c0 4.4 3.6 8 8 8s8-3.6 8-8v-4l3 3-3-3-3 3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. UPLOAD GALLERY MODE -->
      <div v-if="activeTab === 'upload' && !capturedImage" class="upload-stage">
        <div 
          class="dropzone" 
          :class="{ dragging: isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleFileDrop"
          @click="triggerFileInput"
        >
          <input 
            type="file" 
            ref="fileInputRef" 
            accept="image/png, image/jpeg, image/webp" 
            style="display: none;" 
            @change="handleFileSelect"
          />

          <div class="dropzone-content">
            <div class="upload-icon-circle">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <h3>Tarik & Letakkan Foto Di Sini</h3>
            <p class="upload-hint">Mendukung format PNG, JPG, JPEG, WEBP (Maksimal 15MB)</p>
            <button class="btn btn-primary" @click.stop="triggerFileInput">
              📁 Pilih Foto dari Perangkat
            </button>
          </div>
        </div>

        <!-- Sample Demo Photos for Instant Testing -->
        <div class="sample-photos-section">
          <p class="sample-title">Atau gunakan contoh foto model untuk uji coba instan:</p>
          <div class="sample-grid">
            <div 
              v-for="(sample, idx) in samplePhotos" 
              :key="idx" 
              class="sample-card" 
              @click="loadSamplePhoto(sample)"
            >
              <img :src="sample.url" :alt="sample.label" />
              <span class="sample-badge">{{ sample.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. CAPTURED / SELECTED PREVIEW CONFIRMATION -->
      <div v-if="capturedImage" class="preview-stage">
        <div class="preview-card">
          <img :src="capturedImage" alt="Captured Photo" class="preview-img" />
          <div class="preview-overlay-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            Foto Siap Diproses
          </div>
        </div>

        <!-- Confirmation Action Buttons -->
        <div class="preview-actions">
          <button class="btn btn-secondary btn-lg" @click="retakePhoto">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            <span>Ambil Ulang</span>
          </button>

          <button class="btn btn-primary btn-lg pulse-glow" @click="confirmAndProceed">
            <span>Lanjut ke AI Studio</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  initialImage: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['photo-captured', 'go-next']);

// Tab State
const activeTab = ref('camera');
const capturedImage = ref(props.initialImage || null);
const isDragging = ref(false);

// Camera State
const videoRef = ref(null);
const fileInputRef = ref(null);
const stream = ref(null);
const cameraError = ref(null);
const isCameraLoading = ref(false);
const isFrontCamera = ref(true);
const devices = ref([]);
const currentDeviceId = ref(null);
const selectedTimer = ref(3); // default 3s countdown
const countdown = ref(0);

// Sample Photos for testing
const samplePhotos = [
  {
    label: 'Model Wanita',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&auto=format&fit=crop&q=80'
  },
  {
    label: 'Model Pria',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=80'
  },
  {
    label: 'Model Studio',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&auto=format&fit=crop&q=80'
  }
];

// Switch Tab
function switchTab(tab) {
  activeTab.value = tab;
  if (tab === 'camera') {
    startCamera();
  } else {
    stopCamera();
  }
}

// Camera Management
async function startCamera() {
  stopCamera();
  isCameraLoading.value = true;
  cameraError.value = null;

  try {
    const constraints = {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        aspectRatio: { ideal: 16 / 9 },
        facingMode: isFrontCamera.value ? 'user' : 'environment'
      },
      audio: false
    };

    if (currentDeviceId.value) {
      constraints.video.deviceId = { exact: currentDeviceId.value };
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.value = mediaStream;

    await nextTick();
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream;
      await videoRef.value.play();
    }

    // Enumerate devices
    const devList = await navigator.mediaDevices.enumerateDevices();
    devices.value = devList.filter(d => d.kind === 'videoinput');
  } catch (err) {
    console.error('Camera access error:', err);
    cameraError.value = 'Mohon izinkan akses kamera di peramban (browser) Anda untuk menggunakan fitur photobooth.';
  } finally {
    isCameraLoading.value = false;
  }
}

function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
}

function toggleCameraFacing() {
  isFrontCamera.value = !isFrontCamera.value;
  startCamera();
}

// Sound synthesized shutter snap
function playShutterSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  } catch (e) {}
}

// Trigger Capture with Countdown
function triggerCapture() {
  if (selectedTimer.value > 0) {
    countdown.value = selectedTimer.value;
    const interval = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(interval);
        executeCapture();
      }
    }, 1000);
  } else {
    executeCapture();
  }
}

// Execute 9:16 Portrait Capture
function executeCapture() {
  if (!videoRef.value) return;

  // Flash animation
  const flashEl = document.createElement('div');
  flashEl.className = 'photobooth-flash flash-active';
  document.body.appendChild(flashEl);
  setTimeout(() => {
    flashEl.classList.remove('flash-active');
    setTimeout(() => flashEl.remove(), 200);
  }, 100);

  // Play shutter sound
  playShutterSound();

  const video = videoRef.value;
  const canvas = document.createElement('canvas');
  const vw = video.videoWidth || 1920;
  const vh = video.videoHeight || 1080;
  const targetRatio = 16 / 9;

  let cropWidth, cropHeight;
  if (vw / vh > targetRatio) {
    cropHeight = vh;
    cropWidth = vh * targetRatio;
  } else {
    cropWidth = vw;
    cropHeight = vw / targetRatio;
  }

  canvas.width = Math.round(cropWidth);
  canvas.height = Math.round(cropHeight);

  const ctx = canvas.getContext('2d');

  // Handle horizontal flip for front camera mirror effect
  if (isFrontCamera.value) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  // Center-crop video to 9:16 photobooth vertical portrait
  const sx = (vw - cropWidth) / 2;
  const sy = (vh - cropHeight) / 2;
  ctx.drawImage(video, sx, sy, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

  const base64 = canvas.toDataURL('image/jpeg', 0.95);
  capturedImage.value = base64;
  stopCamera();
  emit('photo-captured', base64);
}

// Crop helper for 9:16 aspect ratio
function cropImageTo916(imgSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const iw = img.naturalWidth || 1920;
      const ih = img.naturalHeight || 1080;
      const targetRatio = 16 / 9;

      let cw, ch;
      if (iw / ih > targetRatio) {
        ch = ih;
        cw = ih * targetRatio;
      } else {
        cw = iw;
        ch = iw / targetRatio;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(cw);
      canvas.height = Math.round(ch);
      const ctx = canvas.getContext('2d');
      const sx = (iw - cw) / 2;
      const sy = (ih - ch) / 2;

      ctx.drawImage(img, sx, sy, cw, ch, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = () => resolve(imgSrc);
    img.src = imgSrc;
  });
}

// Upload handlers
function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
}

function handleFileSelect(e) {
  const file = e.target.files?.[0];
  if (file) processUploadedFile(file);
}

function handleFileDrop(e) {
  isDragging.value = false;
  const file = e.dataTransfer.files?.[0];
  if (file) processUploadedFile(file);
}

function processUploadedFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Mohon pilih file gambar yang valid (PNG/JPG/WEBP).');
    return;
  }
  const reader = new FileReader();
  reader.onload = async (event) => {
    const cropped = await cropImageTo916(event.target.result);
    capturedImage.value = cropped;
    emit('photo-captured', cropped);
  };
  reader.readAsDataURL(file);
}

// Load sample photo
async function loadSamplePhoto(sample) {
  const cropped = await cropImageTo916(sample.url);
  capturedImage.value = cropped;
  emit('photo-captured', cropped);
}

// Retake & Confirm
function retakePhoto() {
  capturedImage.value = null;
  if (activeTab.value === 'camera') {
    startCamera();
  }
}

function confirmAndProceed() {
  emit('go-next');
}

onMounted(() => {
  if (!capturedImage.value && activeTab.value === 'camera') {
    startCamera();
  }
});

onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
.step1-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-header-text {
  text-align: center;
  margin-bottom: 24px;
}

.step-title {
  font-size: 32px;
  font-weight: 800;
  margin: 10px 0 6px;
  color: var(--text-primary);
}

.step-desc {
  color: var(--text-secondary);
  font-size: 14px;
  max-width: 550px;
}

/* Tabs */
.mode-tabs {
  display: flex;
  background: #f1f5f9;
  padding: 5px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  margin-bottom: 24px;
  gap: 6px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: var(--radius-full);
  background: none;
  border: none;
  color: var(--text-secondary);
  font-family: var(--font-main);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  background: #ffffff;
  color: var(--accent-primary);
  box-shadow: var(--shadow-sm);
}

/* Stage Wrapper */
.stage-wrapper {
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
}

/* 1. Camera Stage */
.camera-stage {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-viewport {
  position: relative;
  width: 100%;
  max-width: 640px;
  aspect-ratio: 16 / 9;
  background: #0f172a;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 2px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
}

.camera-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.camera-feed.mirrored {
  transform: scaleX(-1);
}

/* Camera Grid */
.camera-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
}

.grid-line.vertical {
  top: 0;
  bottom: 0;
  width: 1px;
}
.grid-line.vertical.line-1 { left: 33.33%; }
.grid-line.vertical.line-2 { left: 66.66%; }

.grid-line.horizontal {
  left: 0;
  right: 0;
  height: 1px;
}
.grid-line.horizontal.line-1 { top: 33.33%; }
.grid-line.horizontal.line-2 { top: 66.66%; }

/* Countdown */
.countdown-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.countdown-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--grad-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(79, 70, 229, 0.8);
  animation: pulse 1s infinite;
}

.countdown-num {
  font-family: var(--font-main);
  font-size: 64px;
  font-weight: 900;
  color: #ffffff;
}

.countdown-tip {
  margin-top: 16px;
  font-size: 16px;
  font-weight: 700;
  color: #fbbf24;
}

/* Overlays */
.camera-error-overlay, .camera-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  gap: 12px;
  color: #ffffff;
}

.error-icon {
  font-size: 38px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toolbar */
.camera-toolbar {
  width: 100%;
  max-width: 640px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding: 10px 16px;
  background: #f8fafc;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.toolbar-group.right-align {
  justify-content: flex-end;
}

.toolbar-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.timer-chips {
  display: flex;
  gap: 4px;
}

.timer-chip {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  background: #ffffff;
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.timer-chip.active {
  background: var(--accent-primary);
  color: #ffffff;
  border-color: var(--accent-primary);
}

/* Shutter Button */
.shutter-button {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #ffffff;
  border: 4px solid #c7d2fe;
  padding: 4px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.shutter-button:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5);
}

.shutter-button:active:not(:disabled) {
  transform: scale(0.95);
}

.shutter-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--grad-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

/* 2. Upload Stage */
.upload-stage {
  width: 100%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dropzone {
  border: 2px dashed #a5b4fc;
  border-radius: var(--radius-lg);
  padding: 40px 20px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.dropzone:hover, .dropzone.dragging {
  border-color: var(--accent-primary);
  background: #eef2ff;
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.15);
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon-circle {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
}

.upload-hint {
  font-size: 12px;
  color: var(--text-muted);
}

/* Sample Photos */
.sample-photos-section {
  text-align: center;
}

.sample-title {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  font-weight: 600;
}

.sample-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.sample-card {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: 16 / 9;
  cursor: pointer;
  border: 1px solid var(--border-subtle);
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.sample-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-md);
}

.sample-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.sample-badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  right: 6px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: var(--radius-sm);
  text-align: center;
}

/* 3. Preview Confirmation Stage */
.preview-stage {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.preview-card {
  position: relative;
  max-width: 640px;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 2px solid var(--accent-primary);
  box-shadow: var(--shadow-md);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-overlay-tag {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #059669;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.preview-actions {
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 480px;
}

.preview-actions .btn {
  flex: 1;
}

@media (max-width: 600px) {
  .step1-container {
    padding: 16px 12px 40px;
  }

  .stage-wrapper {
    padding: 14px 10px;
    border-radius: var(--radius-md);
  }

  .mode-tabs {
    width: 100%;
  }

  .tab-btn {
    flex: 1;
    justify-content: center;
    padding: 8px 12px;
    font-size: 13px;
  }

  .camera-toolbar {
    padding: 8px 12px;
    gap: 8px;
  }

  .toolbar-label {
    display: none;
  }

  .shutter-button {
    width: 64px;
    height: 64px;
  }

  .dropzone {
    padding: 24px 14px;
  }

  .upload-icon-circle {
    width: 52px;
    height: 52px;
  }

  .sample-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .sample-badge {
    font-size: 9px;
    padding: 2px 4px;
  }

  .preview-actions {
    flex-direction: column;
    width: 100%;
  }
}
</style>
