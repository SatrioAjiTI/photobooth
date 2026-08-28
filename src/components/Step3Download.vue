<template>
  <div class="step3-container">
    <!-- Header Title -->
    <div class="step-header-text no-print">
      <div class="badge badge-primary">LANGKAH 3 DARI 3</div>
      <h2 class="step-title">Edisi Koran Berita, Unduh & Cetak</h2>
      <p class="step-desc">Pilih peminatan Program Studi dari formulir di kanan, lengkapi data diri & kuesioner responden untuk membuka akses unduh HD, QR Code HP, dan cetak foto.</p>
    </div>

    <!-- Main Step 3 Grid -->
    <div class="download-grid">
      <!-- LEFT COLUMN: Live Newspaper Edition Frame Preview -->
      <div class="preview-col no-print">
        <!-- Rendered Newspaper Frame Preview Card -->
        <div class="framed-preview-card glass-panel">
          <div class="preview-card-header">
            <span class="badge badge-amber">📰 PREVIEW EDISI KORAN BERITA</span>
            <span class="preview-prodi-tag">Prodi: <strong>{{ currentProdi.name }}</strong></span>
          </div>

          <div v-if="isRendering" class="render-loading">
            <div class="spinner"></div>
            <span>Menyusun tata letak koran berita resolusi tinggi...</span>
          </div>
          <div v-else class="preview-img-box">
            <img :src="renderedFramedImage" alt="Framed Newspaper Result" class="rendered-image" />
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Mandatory Guest Form with 2-Tab Structure & Download Actions -->
      <div class="actions-col no-print">
        <!-- 1. MANDATORY GUEST DATA & QUESTIONNAIRE 2-TAB FORM -->
        <div v-if="!isFormSubmitted" class="guest-form-card glass-panel">
          <div class="form-card-header">
            <div class="badge badge-amber">WAJIB DIISI</div>
            <h3>Formulir Registrasi & Kuesioner</h3>
            <p class="form-header-sub">Lengkapi 2 bagian berikut untuk membuka akses unduh HD, QR Code, dan cetak foto.</p>
          </div>

          <!-- Main 2-Tab Navigation -->
          <div class="form-tabs-nav">
            <button 
              type="button" 
              class="form-tab-btn" 
              :class="{ active: activeFormTab === 'data_pengunjung' }"
              @click="activeFormTab = 'data_pengunjung'"
            >
              <span class="tab-badge-num">1</span>
              <span>👤 Data Pengunjung</span>
            </button>
            <button 
              type="button" 
              class="form-tab-btn" 
              :class="{ active: activeFormTab === 'kuesioner' }"
              @click="activeFormTab = 'kuesioner'"
            >
              <span class="tab-badge-num">2</span>
              <span>📋 Kuesioner Riset</span>
            </button>
          </div>

          <form @submit.prevent="handleSubmitGuestForm" class="guest-form">
            <!-- ================= TAB 1: DATA PENGUNJUNG ================= -->
            <div v-show="activeFormTab === 'data_pengunjung'" class="form-tab-pane">
              <!-- Nama Lengkap -->
              <div class="form-group">
                <label class="form-label">Nama Lengkap <span class="req">*</span></label>
                <input 
                  type="text" 
                  v-model="guestForm.name" 
                  @input="debouncedRender"
                  class="form-input" 
                  placeholder="Contoh: Budi Santoso" 
                  required 
                />
              </div>

              <!-- Umur & Jenis Kelamin Row -->
              <div class="form-row-2col">
                <!-- Umur / Usia -->
                <div class="form-group">
                  <label class="form-label">Umur / Usia <span class="req">*</span></label>
                  <input 
                    type="number" 
                    v-model.number="guestForm.age" 
                    class="form-input" 
                    placeholder="Contoh: 20" 
                    min="1" 
                    max="120"
                    required 
                  />
                </div>

                <!-- Jenis Kelamin -->
                <div class="form-group">
                  <label class="form-label">Jenis Kelamin <span class="req">*</span></label>
                  <div class="gender-pill-group">
                    <button 
                      type="button" 
                      class="gender-pill-btn" 
                      :class="{ active: guestForm.gender === 'Laki-laki' }"
                      @click="guestForm.gender = 'Laki-laki'"
                    >
                      <span>👨 Laki-laki</span>
                    </button>
                    <button 
                      type="button" 
                      class="gender-pill-btn" 
                      :class="{ active: guestForm.gender === 'Perempuan' }"
                      @click="guestForm.gender = 'Perempuan'"
                    >
                      <span>👩 Perempuan</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Nomor WhatsApp / HP -->
              <div class="form-group">
                <label class="form-label">Nomor WhatsApp / HP <span class="req">*</span></label>
                <input 
                  type="tel" 
                  v-model="guestForm.phone" 
                  class="form-input" 
                  placeholder="Contoh: 08123456789" 
                  required 
                />
              </div>

              <!-- Alamat Email -->
              <div class="form-group">
                <label class="form-label">Alamat Email <span class="req">*</span></label>
                <input 
                  type="email" 
                  v-model="guestForm.email" 
                  class="form-input" 
                  placeholder="Contoh: budi@gmail.com" 
                  required 
                />
              </div>

              <!-- Peminatan Program Studi (Dropdown) -->
              <div class="form-group">
                <label class="form-label">Peminatan Program Studi (Konten Koran) <span class="req">*</span></label>
                <select 
                  v-model="guestForm.prodiId" 
                  @change="changeProdi(guestForm.prodiId)"
                  class="form-select font-semibold prodi-select"
                  required
                >
                  <option v-for="p in PRODI_OPTIONS" :key="p.id" :value="p.id">
                    {{ p.icon }} {{ p.name }} — {{ p.faculty }}
                  </option>
                </select>
                <p class="field-hint">Konten berita, headline, dan artikel koran di sebelah kiri otomatis disesuaikan dengan prodi ini.</p>
              </div>

              <!-- Next Button to Tab 2 -->
              <div class="tab-action-row mt-4">
                <button 
                  type="button" 
                  class="btn btn-primary btn-lg tab-nav-next-btn"
                  @click="goToQuestionnaireTab"
                >
                  <span>Lanjut ke Kuesioner (Langkah 2/2) →</span>
                </button>
              </div>
            </div>

            <!-- ================= TAB 2: KUESIONER RISET (SEAMLESS COMBINED) ================= -->
            <div v-show="activeFormTab === 'kuesioner'" class="form-tab-pane">
              <!-- Q1: Kemiripan Muka -->
              <div class="q-item-box">
                <label class="q-label">1. Apakah muka yang dihasilkan masih mirip dengan aslinya? <span class="req">*</span></label>
                <div class="scale-options">
                  <button 
                    v-for="val in [1, 2, 3, 4, 5]" 
                    :key="val" 
                    type="button" 
                    class="scale-btn"
                    :class="{ selected: questionnaire.q1_face === val }"
                    @click="questionnaire.q1_face = val"
                  >
                    <span class="scale-num">{{ val }}</span>
                    <span class="scale-desc">{{ getScaleDesc('q1', val) }}</span>
                  </button>
                </div>
              </div>

              <!-- Q2: Kemiripan Pose -->
              <div class="q-item-box">
                <label class="q-label">2. Apakah pose / gaya masih mirip dengan aslinya? <span class="req">*</span></label>
                <div class="scale-options">
                  <button 
                    v-for="val in [1, 2, 3, 4, 5]" 
                    :key="val" 
                    type="button" 
                    class="scale-btn"
                    :class="{ selected: questionnaire.q2_pose === val }"
                    @click="questionnaire.q2_pose = val"
                  >
                    <span class="scale-num">{{ val }}</span>
                    <span class="scale-desc">{{ getScaleDesc('q2', val) }}</span>
                  </button>
                </div>
              </div>

              <!-- Q3: Kemiripan Keyword & Gambar -->
              <div class="q-item-box">
                <label class="q-label">3. Seberapa mirip hasil Keyword dan Gambar? <span class="req">*</span></label>
                <div class="scale-options">
                  <button 
                    v-for="val in [1, 2, 3, 4, 5]" 
                    :key="val" 
                    type="button" 
                    class="scale-btn"
                    :class="{ selected: questionnaire.q3_keyword === val }"
                    @click="questionnaire.q3_keyword = val"
                  >
                    <span class="scale-num">{{ val }}</span>
                    <span class="scale-desc">{{ getScaleDesc('q3', val) }}</span>
                  </button>
                </div>
              </div>

              <!-- Q4: Keseruan untuk Brosur -->
              <div class="q-item-box">
                <label class="q-label">4. Seberapa seru AI Photobooth untuk brosur? <span class="req">*</span></label>
                <div class="scale-options">
                  <button 
                    v-for="val in [1, 2, 3, 4, 5]" 
                    :key="val" 
                    type="button" 
                    class="scale-btn"
                    :class="{ selected: questionnaire.q4_marketing === val }"
                    @click="questionnaire.q4_marketing = val"
                  >
                    <span class="scale-num">{{ val }}</span>
                    <span class="scale-desc">{{ getScaleDesc('q4', val) }}</span>
                  </button>
                </div>
              </div>

              <!-- Q5: Preferensi Brosur -->
              <div class="q-item-box">
                <label class="q-label">5. Apabila Anda diperbolehkan memilih, mana yang lebih sesuai untuk Anda? <span class="req">*</span></label>
                <div class="choice-cards-stack">
                  <div 
                    class="choice-card"
                    :class="{ selected: questionnaire.q5_brochure_preference === 'brosur_fisik' }"
                    @click="questionnaire.q5_brochure_preference = 'brosur_fisik'"
                  >
                    <div class="choice-radio"></div>
                    <div class="choice-info">
                      <h5>📄 Brosur Fisik Konvensional</h5>
                      <p>Brosur kertas cetak biasa tanpa interaksi digital AI</p>
                    </div>
                  </div>

                  <div 
                    class="choice-card"
                    :class="{ selected: questionnaire.q5_brochure_preference === 'brosur_kreatif' }"
                    @click="questionnaire.q5_brochure_preference = 'brosur_kreatif'"
                  >
                    <div class="choice-radio"></div>
                    <div class="choice-info">
                      <h5>✨ Brosur Kreatif Interaktif (AI Photobooth)</h5>
                      <p>Foto diri dalam konsep koran berita kampus interaktif & digital</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Komentar & Saran Feedback (Opsional) -->
              <div class="form-group mt-3">
                <label class="form-label">Komentar & Saran Feedback Tambahan <span class="opt-label">(Opsional)</span></label>
                <textarea 
                  v-model="guestForm.feedback" 
                  class="form-textarea" 
                  placeholder="Ceritakan pengalaman photobooth koran AI Anda atau saran untuk kampus (opsional)..." 
                  rows="2"
                ></textarea>
              </div>

              <!-- Bottom Action Row: Back to Tab 1 + Final Submit -->
              <div class="tab-action-row-split mt-3">
                <button 
                  type="button" 
                  class="btn btn-secondary tab-back-btn"
                  @click="activeFormTab = 'data_pengunjung'"
                >
                  <span>← Kembali</span>
                </button>

                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg pulse-glow submit-guest-btn"
                  :disabled="isSubmittingForm"
                >
                  <svg v-if="!isSubmittingForm" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  <span>{{ isSubmittingForm ? 'Menyimpan Kuesioner...' : 'Kirim & Buka Akses Unduh ✨' }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- 2. UNLOCKED DOWNLOAD & PRINT ACTIONS -->
        <div v-else class="unlocked-actions-card glass-panel">
          <div class="unlocked-header">
            <div class="unlocked-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Kuesioner & Data Berhasil Direkam!</span>
            </div>
            <h3>Terima Kasih, {{ guestForm.name }}! 🎉</h3>
            <p class="unlocked-sub">Edisi Koran Berita <strong>{{ currentProdi.name }}</strong> Anda siap diunduh, di-scan ke smartphone, atau dicetak langsung.</p>
          </div>

          <!-- Main Action Buttons -->
          <div class="action-buttons-stack">
            <!-- 1. QR Code Mobile Download (Primary) -->
            <button class="btn btn-primary btn-lg pulse-glow action-btn" @click="openQrModal">
              <div class="action-btn-left">
                <div class="action-icon-circle">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </div>
                <div class="action-btn-text">
                  <span class="action-title">Scan QR Code HP</span>
                  <span class="action-desc">Pindai dengan kamera HP untuk simpan foto langsung ke galeri</span>
                </div>
              </div>
              <span class="badge badge-emerald">Scan QR</span>
            </button>

            <!-- 2. Direct Print -->
            <button class="btn btn-secondary btn-lg action-btn" @click="triggerDirectPrint">
              <div class="action-btn-left">
                <div class="action-icon-circle">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                </div>
                <div class="action-btn-text">
                  <span class="action-title">Cetak Koran Berita (Print)</span>
                  <span class="action-desc">Kirim langsung ke printer foto yang terhubung</span>
                </div>
              </div>
              <span class="badge badge-amber">Print</span>
            </button>
          </div>

          <!-- Reset / New Session Button -->
          <div class="new-session-wrap">
            <button class="btn btn-secondary new-session-btn" @click="$emit('reset-session')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              <span>Selesai & Mulai Sesi Foto Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- QR CODE MODAL -->
    <div v-if="isQrModalOpen" class="modal-overlay no-print" @click="isQrModalOpen = false">
      <div class="modal-card qr-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-header-left">
            <span class="modal-icon">📱</span>
            <h3>Scan QR Code di Smartphone</h3>
          </div>
          <button class="btn btn-secondary btn-icon btn-sm" @click="isQrModalOpen = false">×</button>
        </div>

        <div class="qr-modal-body">
          <div class="qr-canvas-box">
            <img :src="qrCodeDataUrl" alt="QR Code" class="qr-img" />
          </div>
          <p class="qr-instruction">
            Buka kamera di smartphone Anda (iPhone / Android), lalu arahkan ke kode QR di atas untuk membuka & menyimpan foto koran ke galeri HP.
          </p>
          <div class="qr-link-box">
            <span class="qr-link-text">{{ mobileDownloadUrl }}</span>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-primary" @click="isQrModalOpen = false">Tutup</button>
        </div>
      </div>
    </div>

    <!-- PRINTABLE CONTAINER (Visible ONLY during window.print()) -->
    <div id="printable-photobooth-area">
      <img :src="renderedFramedImage" alt="Printable Photo" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import axios from 'axios';
import { PRODI_OPTIONS, getProdiById } from '../data/prodiData.js';
import { renderPhotoboothFrame } from '../services/canvasRenderer.js';
import { guestService } from '../services/guestService.js';

const props = defineProps({
  aiImage: {
    type: String,
    required: true
  },
  initialGuestData: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['reset-session']);

// Prodi & Frame State
const selectedProdiId = ref('informatika');
const renderedFramedImage = ref('');
const isRendering = ref(true);

const currentProdi = computed(() => getProdiById(selectedProdiId.value));

// Active Form Tab: 'data_pengunjung' | 'kuesioner'
const activeFormTab = ref('data_pengunjung');

// Guest Form State
const isFormSubmitted = ref(false);
const isSubmittingForm = ref(false);
const guestForm = ref({
  name: '',
  age: null,
  gender: 'Laki-laki',
  phone: '',
  email: '',
  prodiId: 'informatika',
  feedback: ''
});

// Questionnaire State (Scale 1-5 & Preference - Default UNFILLED)
const questionnaire = ref({
  q1_face: null,
  q2_pose: null,
  q3_keyword: null,
  q4_marketing: null,
  q5_brochure_preference: null
});

// QR Modal & Mobile Download
const isQrModalOpen = ref(false);
const qrCodeDataUrl = ref('');
const mobileDownloadUrl = ref('');
const savedPhotoId = ref(null);

function getScaleDesc(questionKey, val) {
  const descriptions = {
    q1: { 1: 'Tidak Mirip', 2: 'Kurang', 3: 'Cukup', 4: 'Mirip', 5: 'Sangat Mirip' },
    q2: { 1: 'Berubah', 2: 'Kurang', 3: 'Cukup', 4: 'Mirip', 5: 'Sangat Mirip' },
    q3: { 1: 'Tidak Sesuai', 2: 'Kurang', 3: 'Cukup', 4: 'Sesuai', 5: 'Sangat Sesuai' },
    q4: { 1: 'Biasa', 2: 'Cukup', 3: 'Menarik', 4: 'Seru', 5: 'Sangat Seru!' }
  };
  return descriptions[questionKey]?.[val] || '';
}

// Switch to Questionnaire Tab with quick validation
function goToQuestionnaireTab() {
  if (!guestForm.value.name.trim()) {
    alert('Mohon masukkan Nama Lengkap terlebih dahulu.');
    return;
  }
  if (!guestForm.value.age || guestForm.value.age < 1) {
    alert('Mohon masukkan Umur / Usia Anda yang valid.');
    return;
  }
  if (!guestForm.value.gender) {
    alert('Mohon pilih Jenis Kelamin terlebih dahulu.');
    return;
  }
  if (!guestForm.value.phone.trim()) {
    alert('Mohon masukkan Nomor WhatsApp / HP terlebih dahulu.');
    return;
  }
  if (!guestForm.value.email.trim()) {
    alert('Mohon masukkan Alamat Email terlebih dahulu.');
    return;
  }
  activeFormTab.value = 'kuesioner';
}

// Debounced Canvas Renderer
let renderTimeout = null;
function debouncedRender() {
  clearTimeout(renderTimeout);
  renderTimeout = setTimeout(() => {
    generateRenderedFrame();
  }, 250);
}

async function generateRenderedFrame() {
  isRendering.value = true;
  try {
    const result = await renderPhotoboothFrame({
      imageSrc: props.aiImage,
      prodiId: selectedProdiId.value,
      guestName: guestForm.value.name || '',
      eventTitle: currentProdi.value.newspaperTitle
    });
    renderedFramedImage.value = result;
  } catch (error) {
    console.error('Frame rendering error:', error);
    renderedFramedImage.value = props.aiImage;
  } finally {
    isRendering.value = false;
  }
}

function changeProdi(prodiId) {
  selectedProdiId.value = prodiId;
  guestForm.value.prodiId = prodiId;
  generateRenderedFrame();
}

// Submit Guest Form & Questionnaire
async function handleSubmitGuestForm() {
  if (!guestForm.value.name || !guestForm.value.age || !guestForm.value.gender || !guestForm.value.phone || !guestForm.value.email) {
    activeFormTab.value = 'data_pengunjung';
    alert('Mohon lengkapi seluruh kolom formulir data diri (nama, umur, jenis kelamin, HP, email) terlebih dahulu.');
    return;
  }

  if (
    questionnaire.value.q1_face === null ||
    questionnaire.value.q2_pose === null ||
    questionnaire.value.q3_keyword === null ||
    questionnaire.value.q4_marketing === null ||
    !questionnaire.value.q5_brochure_preference
  ) {
    activeFormTab.value = 'kuesioner';
    alert('Mohon jawab seluruh pertanyaan kuesioner riset (nomor 1 sampai 5) terlebih dahulu.');
    return;
  }

  isSubmittingForm.value = true;

  try {
    const prodi = getProdiById(guestForm.value.prodiId);

    // 1. Save framed newspaper image to server for QR code mobile download
    let photoUrl = '';
    let photoId = 'photo_' + Date.now();
    
    try {
      const uploadRes = await axios.post('/api/photos/save', {
        imageBase64: renderedFramedImage.value,
        frameType: 'newspaper-edition',
        guestName: guestForm.value.name,
        prodiId: prodi.id,
        prodiName: prodi.name
      });
      if (uploadRes.data?.success) {
        photoId = uploadRes.data.photoId;
        mobileDownloadUrl.value = uploadRes.data.downloadUrl;
        savedPhotoId.value = photoId;
      }
    } catch (e) {
      console.warn('Could not save photo to backend, using direct fallback', e);
      mobileDownloadUrl.value = window.location.origin;
    }

    // 2. Submit guest record (using q1_face as overall rating)
    await guestService.submitGuest({
      name: guestForm.value.name,
      age: guestForm.value.age,
      gender: guestForm.value.gender,
      phone: guestForm.value.phone,
      email: guestForm.value.email,
      rating: questionnaire.value.q1_face || 5,
      feedback: guestForm.value.feedback,
      prodiId: prodi.id,
      prodiName: prodi.name,
      photoId: photoId,
      photoUrl: photoUrl
    });

    // 3. Submit Questionnaire Responses
    try {
      await axios.post('/api/questionnaires', {
        photoId: photoId,
        respondentName: guestForm.value.name,
        respondentAge: guestForm.value.age,
        respondentGender: guestForm.value.gender,
        q1_face: questionnaire.value.q1_face,
        q2_pose: questionnaire.value.q2_pose,
        q3_keyword: questionnaire.value.q3_keyword,
        q4_marketing: questionnaire.value.q4_marketing,
        q5_brochure_preference: questionnaire.value.q5_brochure_preference
      });
    } catch (qErr) {
      console.warn('Could not record questionnaire to backend, continuing...', qErr);
    }

    // 4. Generate QR Code
    const targetUrl = mobileDownloadUrl.value || window.location.origin;
    const qrData = await QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
    qrCodeDataUrl.value = qrData;

    // Trigger celebration confetti
    triggerConfetti();

    isFormSubmitted.value = true;
  } catch (error) {
    console.error('Submit error:', error);
    alert('Terjadi kesalahan saat menyimpan data: ' + error.message);
  } finally {
    isSubmittingForm.value = false;
  }
}

// Confetti burst
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Download HD Photo
function downloadHdPhoto() {
  const link = document.createElement('a');
  link.download = `Warta-Kampus-${currentProdi.value.id}-${Date.now()}.png`;
  link.href = renderedFramedImage.value;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// QR Code Modal Open
function openQrModal() {
  isQrModalOpen.value = true;
}

// Direct Print Trigger
function triggerDirectPrint() {
  window.print();
}

onMounted(() => {
  generateRenderedFrame();
});
</script>

<style scoped>
.step3-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 24px 20px 60px;
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
  max-width: 680px;
  margin: 0 auto;
}

.download-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 24px;
  align-items: start;
}

/* LEFT COLUMN: Newspaper Preview */
.framed-preview-card {
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 520px;
  background: #ffffff;
}

.preview-card-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-subtle);
}

.preview-prodi-tag {
  font-size: 12px;
  color: var(--text-secondary);
}

.preview-prodi-tag strong {
  color: var(--accent-primary);
}

.render-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: var(--text-secondary);
  font-size: 14px;
  min-height: 400px;
}

.preview-img-box {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.rendered-image {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  display: block;
}

/* RIGHT COLUMN: Guest Form & Tabs */
.guest-form-card,
.unlocked-actions-card {
  padding: 24px;
  background: #ffffff;
}

.form-card-header {
  margin-bottom: 16px;
}

.form-card-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 6px 0 3px;
  color: var(--text-primary);
}

.form-header-sub {
  font-size: 13px;
  color: var(--text-secondary);
}

/* Form Top Tabs Switcher (Light Mode) */
.form-tabs-nav {
  display: flex;
  background: #f1f5f9;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 4px;
  gap: 4px;
  margin-bottom: 18px;
}

.form-tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s;
}

.form-tab-btn:hover {
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.03);
}

.form-tab-btn.active {
  background: #ffffff;
  color: var(--accent-primary);
  box-shadow: var(--shadow-sm);
}

.tab-badge-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e2e8f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--text-secondary);
}

.form-tab-btn.active .tab-badge-num {
  background: var(--accent-primary);
  color: #ffffff;
  font-weight: 800;
}

.form-tab-pane {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.prodi-select {
  font-size: 13px;
  padding: 10px 12px;
  background: #ffffff;
  border: 1.5px solid var(--border-medium);
}

.form-row-2col {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 12px;
}

@media (max-width: 480px) {
  .form-row-2col {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.gender-pill-group {
  display: flex;
  gap: 6px;
  background: #f1f5f9;
  padding: 3px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-medium);
}

.gender-pill-btn {
  flex: 1;
  padding: 8px 6px;
  border-radius: var(--radius-sm);
  background: none;
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
  white-space: nowrap;
}

.gender-pill-btn:hover {
  color: var(--text-primary);
}

.gender-pill-btn.active {
  background: #ffffff;
  color: var(--accent-primary);
  box-shadow: var(--shadow-sm);
  font-weight: 700;
}

.req {
  color: var(--accent-rose);
}

.field-hint {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 3px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 18px;
}

/* Tab Navigation Buttons */
.tab-action-row {
  display: flex;
  width: 100%;
}

.tab-nav-next-btn {
  width: 100%;
}

.tab-action-row-split {
  display: flex;
  gap: 10px;
  align-items: center;
}

.tab-back-btn {
  flex-shrink: 0;
}

.submit-guest-btn {
  flex: 1;
}

/* Questionnaire Box & Scale (Light Mode) */
.q-item-box {
  background: #f8fafc;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  margin-bottom: 12px;
}

.q-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  display: block;
  line-height: 1.4;
}

.scale-options {
  display: flex;
  gap: 6px;
  justify-content: space-between;
}

.scale-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: #ffffff;
  border: 1.5px solid var(--border-medium);
  color: var(--text-secondary);
  padding: 8px 3px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  transition: all 0.15s;
}

.scale-btn:hover {
  background: #eef2ff;
  border-color: #a5b4fc;
  color: var(--accent-primary);
}

.scale-btn .scale-num {
  font-size: 14px;
}

.scale-btn .scale-desc {
  font-size: 9px;
  color: var(--text-muted);
  text-align: center;
}

.scale-btn.selected {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.scale-btn.selected .scale-desc {
  color: #e0e7ff;
}

/* Choice Cards (Q5) */
.choice-cards-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}

.choice-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1.5px solid var(--border-medium);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.choice-card:hover {
  background: #f8fafc;
  border-color: #a5b4fc;
}

.choice-card.selected {
  background: #eef2ff;
  border-color: var(--accent-primary);
}

.choice-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #ffffff;
}

.choice-card.selected .choice-radio {
  border-color: var(--accent-primary);
}

.choice-card.selected .choice-radio::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-primary);
}

.choice-info h5 {
  font-size: 13px;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.choice-info p {
  font-size: 11px;
  color: var(--text-secondary);
}

/* Unlocked View */
.unlocked-header {
  text-align: center;
  margin-bottom: 24px;
}

.unlocked-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #d1fae5;
  color: #047857;
  border: 1px solid #a7f3d0;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 12px;
}

.unlocked-header h3 {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.unlocked-sub {
  font-size: 13px;
  color: var(--text-secondary);
}

.action-buttons-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  text-align: left;
  border-radius: var(--radius-lg);
  width: 100%;
}

.action-btn-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.action-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-text {
  display: flex;
  flex-direction: column;
}

.action-title {
  font-size: 15px;
  font-weight: 700;
}

.action-desc {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 400;
}

.new-session-wrap {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--border-subtle);
  text-align: center;
}

.new-session-btn {
  width: 100%;
}

/* QR Code Modal */
.qr-modal {
  max-width: 420px;
  text-align: center;
  background: #ffffff;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header-left h3 {
  font-size: 17px;
  color: var(--text-primary);
}

.qr-modal-body {
  padding: 24px 20px;
}

.qr-canvas-box {
  background: #ffffff;
  padding: 14px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  display: inline-block;
  box-shadow: var(--shadow-md);
  margin-bottom: 16px;
}

.qr-img {
  width: 220px;
  height: 220px;
  display: block;
}

.qr-instruction {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 14px;
}

.qr-link-box {
  background: #f1f5f9;
  border: 1px solid var(--border-subtle);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent-primary);
  word-break: break-all;
}

.modal-footer {
  padding: 14px 24px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: flex-end;
}

/* Printable Container Styling */
#printable-photobooth-area {
  display: none;
}

@media print {
  body * {
    visibility: hidden;
  }
  .no-print {
    display: none !important;
  }
  #printable-photobooth-area,
  #printable-photobooth-area * {
    visibility: visible;
  }
  #printable-photobooth-area {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
  }
  #printable-photobooth-area img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

@media (max-width: 900px) {
  .step3-container {
    padding: 14px 10px 50px;
  }

  .download-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .framed-preview-card {
    padding: 12px;
  }

  .preview-img-box {
    max-height: 480px;
    display: flex;
    justify-content: center;
  }

  .rendered-image {
    max-height: 460px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
  }

  .guest-form-card, .unlocked-card {
    padding: 16px 12px;
  }

  .form-tab-btn {
    padding: 8px 10px;
    font-size: 12px;
  }

  .q-item-box {
    padding: 10px 8px;
    gap: 8px;
  }

  .q-label {
    font-size: 13px;
  }

  .scale-options {
    gap: 4px;
  }

  .scale-btn {
    padding: 6px 2px;
    font-size: 12px;
  }

  .scale-btn .scale-num {
    font-size: 13px;
  }

  .scale-btn .scale-desc {
    font-size: 8px;
  }

  .action-btn {
    padding: 12px 14px;
  }

  .action-icon-circle {
    width: 36px;
    height: 36px;
  }

  .action-title {
    font-size: 14px;
  }
}
</style>
