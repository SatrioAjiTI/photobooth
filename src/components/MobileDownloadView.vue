<template>
  <div class="mobile-download-page">
    <div class="download-container">
      <!-- Top Branding Badge -->
      <div class="top-badge">
        <span>📰 WARTA KAMPUS PHOTOBOOTH</span>
      </div>

      <h1 class="page-title">Foto Koran Anda Sudah Siap!</h1>
      <p class="subtitle">Edisi Eksklusif Berita & Peminatan Program Studi</p>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-card glass-panel">
        <div class="spinner"></div>
        <p>Menyiapkan foto koran resolusi tinggi...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="error-card glass-panel">
        <span class="error-icon">⚠️</span>
        <h3>Foto Belum Ditemukan</h3>
        <p>{{ errorMessage }}</p>
        <button class="btn btn-secondary mt-3" @click="$emit('go-photobooth')">
          📸 Buka AI Photobooth
        </button>
      </div>

      <!-- Success Photo Display -->
      <div v-else class="content-wrapper">
        <div class="photo-frame-card">
          <img 
            :src="photoData?.imageUrl" 
            alt="AI Photobooth Newspaper Edition" 
            class="newspaper-img"
            @load="onImageLoaded"
          />
        </div>

        <!-- Download Action Button -->
        <button class="btn-download-primary" @click="handleDownload">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Unduh Foto Koran (.PNG)</span>
        </button>

        <!-- Smartphone Instructions Card -->
        <div class="mobile-tips-box">
          <span class="tip-icon">💡</span>
          <p>
            <strong>Tips Pengguna iPhone & Android:</strong><br/>
            Anda juga dapat <strong>menahan foto di atas (tekan lama)</strong> lalu pilih <em>"Simpan Gambar"</em> / <em>"Simpan ke Foto"</em> untuk menyimpan langsung ke galeri HP.
          </p>
        </div>

        <!-- Survey Status Box -->
        <div class="survey-status-box glass-panel">
          <div class="status-header">
            <span class="check-badge">✓</span>
            <h4>Kuesioner Riset Berhasil Direkam</h4>
          </div>
          <p>Terima kasih <strong>{{ photoData?.guestName || 'Sobat Kampus' }}</strong> telah berpartisipasi dalam riset evaluasi kualitas AI Photobooth Universitas.</p>
        </div>

        <!-- Footer -->
        <div class="page-footer">
          <p>© 2026 Warta Kampus AI Photobooth Experience • Universitas FTI</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['go-photobooth']);

const isLoading = ref(true);
const errorMessage = ref('');
const photoData = ref(null);

const props = defineProps({
  photoId: {
    type: String,
    default: ''
  }
});

async function loadPhotoData() {
  isLoading.value = true;
  errorMessage.value = '';

  // Extract ID from prop or window location pathname
  let targetId = props.photoId;
  if (!targetId) {
    const parts = window.location.pathname.split('/download/');
    if (parts.length > 1) {
      targetId = parts[1].replace(/\/+$/, '');
    }
  }

  if (!targetId) {
    isLoading.value = false;
    errorMessage.value = 'ID Foto tidak valid.';
    return;
  }

  try {
    const res = await axios.get(`/api/photos/${targetId}`, { timeout: 15000 });
    if (res.data?.success && res.data?.imageUrl) {
      photoData.value = res.data;
    } else {
      errorMessage.value = 'Foto tidak ditemukan atau sesi telah berakhir.';
    }
  } catch (err) {
    console.error('Fetch photo error:', err);
    errorMessage.value = 'Tidak dapat memuat foto. Pastikan koneksi internet stabil.';
  } finally {
    isLoading.value = false;
  }
}

function onImageLoaded() {
  console.log('Mobile framed photo rendered successfully');
}

function handleDownload() {
  if (!photoData.value?.imageUrl) return;

  const link = document.createElement('a');
  link.href = photoData.value.imageUrl;
  link.download = `Warta-Kampus-${photoData.value.photoId || 'photo'}.png`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onMounted(() => {
  loadPhotoData();
});
</script>

<style scoped>
.mobile-download-page {
  min-height: 100vh;
  background: linear-gradient(145deg, #090d16 0%, #0f172a 50%, #0c101d 100%);
  color: #f8fafc;
  padding: 30px 16px 60px;
  display: flex;
  justify-content: center;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

.download-container {
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

.page-title {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
}

.subtitle {
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 22px;
}

.photo-frame-card {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.2);
  margin-bottom: 20px;
}

.newspaper-img {
  width: 100%;
  height: auto;
  border-radius: 14px;
  display: block;
}

.btn-download-primary {
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
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.5);
  margin-bottom: 16px;
  transition: transform 0.15s, box-shadow 0.15s;
}

.btn-download-primary:active {
  transform: scale(0.98);
}

.mobile-tips-box {
  background: rgba(15, 23, 42, 0.6);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  padding: 12px 16px;
  display: flex;
  gap: 10px;
  text-align: left;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 20px;
}

.tip-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.survey-status-box {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
  text-align: left;
  margin-bottom: 24px;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.check-badge {
  background: #10b981;
  color: #fff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}

.status-header h4 {
  font-size: 14px;
  color: #34d399;
  margin: 0;
}

.survey-status-box p {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0;
}

.loading-card, .error-card {
  background: #1e293b;
  border-radius: 20px;
  padding: 40px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 36px;
  display: block;
  margin-bottom: 10px;
}

.page-footer {
  font-size: 12px;
  color: #475569;
}
</style>
