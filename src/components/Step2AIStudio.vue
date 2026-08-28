<template>
  <div class="step2-container">
    <!-- Header Title -->
    <div class="step-header-text">
      <div class="step-badges-row">
        <span class="badge badge-primary">LANGKAH 2 DARI 3</span>
        <span 
          v-if="hasToken" 
          class="badge badge-emerald cursor-pointer"
          @click="$emit('open-settings')"
          title="Klik untuk ubah pengaturan model AI"
        >
          🟢 Replicate: {{ currentModelShort }}
        </span>
        <span 
          v-else 
          class="badge badge-amber cursor-pointer"
          @click="$emit('open-settings')"
          title="Klik untuk memasukkan Token Replicate API Anda"
        >
          🟡 Mode Simulator (⚙️ Pasang Token)
        </span>
      </div>
      <h2 class="step-title">AI Style Studio</h2>
      <p class="step-desc">Pilih template gaya di bawah untuk mengubah latar belakang, kostum, objek, dan nuansa visual foto Anda.</p>
    </div>

    <!-- Main Studio Grid -->
    <div class="studio-grid">
      <!-- LEFT COLUMN: Image & AI Result Stage -->
      <div class="studio-preview-col">
        <div class="preview-panel glass-panel">
          <!-- 1. IDLE / READY TO GENERATE (ORIGINAL PHOTO) -->
          <div v-if="!isGenerating && !aiResultImage" class="single-image-wrap">
            <img :src="originalImage" alt="Original Photo" class="main-preview-img" />
            <div class="image-floating-badge">
              <span>📷 Foto Asli</span>
            </div>
          </div>

          <!-- 2. GENERATING / LOADING STATE -->
          <div v-if="isGenerating" class="generating-state">
            <div class="ai-orb-container">
              <div class="ai-orb"></div>
              <div class="ai-orb-ring"></div>
            </div>
            <h3 class="generating-title">Sedang Mentransformasi Foto...</h3>
            <p class="generating-sub">Mengirim instruksi ke ByteDance SeaDream AI Model</p>
            
            <div class="generation-progress-bar">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <span class="progress-step-text">{{ currentProgressStep }}</span>

            <div class="generating-tip-box">
              <span class="tip-icon">💡</span>
              <span class="tip-text">{{ currentTip }}</span>
            </div>
          </div>

          <!-- 3. COMPLETED AI RESULT (WITH INTERACTIVE BEFORE/AFTER SLIDER) -->
          <div v-if="!isGenerating && aiResultImage" class="result-slider-container">
            <!-- View Mode Switcher (Slider vs Side-by-Side) -->
            <div class="view-mode-bar">
              <button 
                class="view-mode-btn" 
                :class="{ active: viewMode === 'split' }"
                @click="viewMode = 'split'"
              >
                <span>↔️ Before / After Slider</span>
              </button>
              <button 
                class="view-mode-btn" 
                :class="{ active: viewMode === 'single' }"
                @click="viewMode = 'single'"
              >
                <span>✨ AI Result</span>
              </button>
            </div>

            <!-- Before / After Interactive Split Slider -->
            <div v-if="viewMode === 'split'" class="split-slider-wrapper" ref="sliderWrapRef" @mousemove="handleSliderMove" @touchmove="handleSliderTouch">
              <!-- AI Result (Underneath) -->
              <img :src="aiResultImage" alt="AI Generated" class="slider-img ai-img" />
              <div class="slider-tag right-tag">✨ AI Result</div>

              <!-- Original (Clipped on top) -->
              <div class="slider-clip" :style="{ width: sliderPosition + '%' }">
                <img :src="originalImage" alt="Original Photo" class="slider-img orig-img" />
                <div class="slider-tag left-tag">📷 Asli</div>
              </div>

              <!-- Draggable Divider Line & Handle -->
              <div class="slider-handle" :style="{ left: sliderPosition + '%' }">
                <div class="handle-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="15 18 9 12 15 6"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </div>

            <!-- Single AI Result View -->
            <div v-if="viewMode === 'single'" class="single-image-wrap">
              <img :src="aiResultImage" alt="AI Generated Photo" class="main-preview-img" />
              <div class="image-floating-badge badge-ai">
                <span>✨ AI Result Generated</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Style Summary Box (Directly below photo, above generate button) -->
        <div class="active-selection-box glass-panel">
          <div class="box-header">
            <div class="box-header-left">
              <span class="box-icon">⚡</span>
              <h4>Gaya & Template Terpilih</h4>
            </div>
            <button 
              v-if="selectedBackground || selectedCostume || selectedObjects.length > 0 || selectedArtStyle"
              class="btn btn-secondary btn-sm clear-btn"
              @click="clearAllSelections"
            >
              Reset
            </button>
          </div>

          <!-- Active Chips -->
          <div class="chips-container">
            <span v-if="selectedBackground" class="preset-chip bg-chip">
              <span>🌄 {{ selectedBackground.name }}</span>
              <button class="chip-remove" @click="selectedBackground = null">×</button>
            </span>

            <span v-if="selectedCostume" class="preset-chip costume-chip">
              <span>🥋 {{ selectedCostume.name }}</span>
              <button class="chip-remove" @click="selectedCostume = null">×</button>
            </span>

            <!-- Multiple Object Chips -->
            <span v-for="obj in selectedObjects" :key="obj.id" class="preset-chip object-chip">
              <span>✨ {{ obj.name }}</span>
              <button class="chip-remove" @click="removeObject(obj)">×</button>
            </span>

            <span v-if="selectedArtStyle" class="preset-chip style-chip">
              <span>🎨 {{ selectedArtStyle.name }}</span>
              <button class="chip-remove" @click="selectedArtStyle = null">×</button>
            </span>

            <span v-if="!selectedBackground && !selectedCostume && selectedObjects.length === 0 && !selectedArtStyle" class="empty-chips-text">
              Silakan pilih kombinasi template Latar, Kostum, Objek & Gaya Seni di sebelah kanan...
            </span>
          </div>
        </div>

        <!-- Action Buttons Below Preview -->
        <div class="studio-bottom-actions">
          <button 
            v-if="!aiResultImage" 
            class="btn btn-primary btn-lg pulse-glow generate-action-btn"
            :disabled="isGenerating"
            @click="runAiGeneration"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
            </svg>
            <span>Generate AI Transformation</span>
          </button>

          <div v-if="aiResultImage && !isGenerating" class="completed-actions-row">
            <button class="btn btn-secondary btn-lg" @click="runAiGeneration">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
              <span>Re-roll / Coba Lagi</span>
            </button>

            <button class="btn btn-primary btn-lg pulse-glow" @click="proceedToDownload">
              <span>Lanjut ke Unduh & Print</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Prompt Controls & Presets -->
      <div class="studio-controls-col">
        <!-- Category Tabs for Template Selection -->
        <div class="presets-container glass-panel">
          <div class="preset-category-tabs">
            <button 
              class="cat-tab" 
              :class="{ active: activeCategory === 'latar' }"
              @click="activeCategory = 'latar'"
            >
              <span>🌄 Latar ({{ BACKGROUND_PRESETS.length }})</span>
            </button>
            <button 
              class="cat-tab" 
              :class="{ active: activeCategory === 'kostum' }"
              @click="activeCategory = 'kostum'"
            >
              <span>👗 Kostum ({{ COSTUME_PRESETS.length }})</span>
            </button>
            <button 
              class="cat-tab" 
              :class="{ active: activeCategory === 'objek' }"
              @click="activeCategory = 'objek'"
            >
              <span>✨ Objek ({{ selectedObjects.length > 0 ? selectedObjects.length + '/5' : OBJECT_PRESETS.length }})</span>
            </button>
            <button 
              class="cat-tab" 
              :class="{ active: activeCategory === 'style' }"
              @click="activeCategory = 'style'"
            >
              <span>🎨 Gaya Seni ({{ ART_STYLES.length }})</span>
            </button>
          </div>

          <!-- Quick Search Filter -->
          <div class="preset-search-wrap">
            <input 
              type="text" 
              v-model="presetSearchQuery" 
              class="form-input preset-search-input" 
              :placeholder="`🔍 Cari template ${activeCategoryLabel}...`"
            />
            <button 
              v-if="presetSearchQuery" 
              class="btn-clear-search" 
              @click="presetSearchQuery = ''"
              title="Hapus pencarian"
            >
              ✕
            </button>
          </div>

          <!-- 1. Latar (Background) Presets Grid -->
          <div v-if="activeCategory === 'latar'" class="presets-grid-wrapper">
            <div v-if="filteredBackgrounds.length === 0" class="no-presets-found">
              <span>Tidak ada latar yang cocok dengan "{{ presetSearchQuery }}".</span>
            </div>
            <div v-else class="presets-grid">
              <div 
                v-for="item in filteredBackgrounds" 
                :key="item.id"
                class="preset-item-card"
                :class="{ selected: selectedBackground?.id === item.id }"
                @click="selectBackground(item)"
              >
                <div class="preset-card-top">
                  <span class="preset-icon">{{ item.icon }}</span>
                  <span class="badge badge-primary">{{ item.badge }}</span>
                </div>
                <h5 class="preset-name">{{ item.name }}</h5>
              </div>
            </div>
          </div>

          <!-- 2. Kostum (Outfits) Presets Grid -->
          <div v-if="activeCategory === 'kostum'" class="presets-grid-wrapper">
            <div v-if="filteredCostumes.length === 0" class="no-presets-found">
              <span>Tidak ada kostum yang cocok dengan "{{ presetSearchQuery }}".</span>
            </div>
            <div v-else class="presets-grid">
              <div 
                v-for="item in filteredCostumes" 
                :key="item.id"
                class="preset-item-card"
                :class="{ selected: selectedCostume?.id === item.id }"
                @click="selectCostume(item)"
              >
                <div class="preset-card-top">
                  <span class="preset-icon">{{ item.icon }}</span>
                  <span class="badge badge-amber">{{ item.badge }}</span>
                </div>
                <h5 class="preset-name">{{ item.name }}</h5>
              </div>
            </div>
          </div>

          <!-- 3. Objek & Lighting Presets Grid (Multi-Select up to 5) -->
          <div v-if="activeCategory === 'objek'" class="presets-grid-wrapper">
            <div class="multi-select-info-bar">
              <span class="multi-select-title">✨ Pilih 1 s/d 5 Objek / Efek Visual:</span>
              <span class="multi-select-count-badge" :class="{ 'count-max': selectedObjects.length === 5 }">
                {{ selectedObjects.length }}/5 Dipilih
              </span>
            </div>
            <div v-if="filteredObjects.length === 0" class="no-presets-found">
              <span>Tidak ada objek yang cocok dengan "{{ presetSearchQuery }}".</span>
            </div>
            <div v-else class="presets-grid">
              <div 
                v-for="item in filteredObjects" 
                :key="item.id"
                class="preset-item-card"
                :class="{ selected: isObjectSelected(item) }"
                @click="selectObject(item)"
              >
                <div class="preset-card-top">
                  <span class="preset-icon">{{ item.icon }}</span>
                  <span class="badge" :class="isObjectSelected(item) ? 'badge-primary' : 'badge-cyan'">
                    {{ isObjectSelected(item) ? '✓ ' + getObjectSelectIndex(item) : item.badge }}
                  </span>
                </div>
                <h5 class="preset-name">{{ item.name }}</h5>
              </div>
            </div>
          </div>

          <!-- 4. Art Styles Presets Grid -->
          <div v-if="activeCategory === 'style'" class="presets-grid-wrapper">
            <div v-if="filteredArtStyles.length === 0" class="no-presets-found">
              <span>Tidak ada gaya seni yang cocok dengan "{{ presetSearchQuery }}".</span>
            </div>
            <div v-else class="presets-grid">
              <div 
                v-for="item in filteredArtStyles" 
                :key="item.id"
                class="preset-item-card"
                :class="{ selected: selectedArtStyle?.id === item.id }"
                @click="selectArtStyle(item)"
              >
                <div class="preset-card-top">
                  <span class="preset-icon">{{ item.icon }}</span>
                  <span class="badge badge-emerald">{{ item.badge }}</span>
                </div>
                <h5 class="preset-name">{{ item.name }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  BACKGROUND_PRESETS, 
  COSTUME_PRESETS, 
  OBJECT_PRESETS, 
  ART_STYLES 
} from '../data/promptTemplates.js';
import { replicateService } from '../services/replicateService.js';
import { getModelById } from '../data/modelsData.js';

const props = defineProps({
  originalImage: {
    type: String,
    required: true
  },
  initialAiImage: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['ai-completed', 'go-next', 'open-settings']);

// Token & Model Status
const hasToken = computed(() => !!replicateService.getToken() || window.__SERVER_HAS_TOKEN);
const currentModelShort = computed(() => {
  const m = replicateService.getModel();
  const info = getModelById(m);
  return info.shortName || m;
});

// Active Selections & Search (Default UNFILLED / EMPTY)
const activeCategory = ref('latar');
const presetSearchQuery = ref('');
const selectedBackground = ref(null);
const selectedCostume = ref(null);
const selectedObjects = ref([]); // Array of up to 5 objects
const selectedArtStyle = ref(null);
const creativityStrength = ref(0.75);

const activeCategoryLabel = computed(() => {
  switch (activeCategory.value) {
    case 'latar': return 'Latar Belakang';
    case 'kostum': return 'Kostum & Pakaian';
    case 'objek': return 'Objek & Efek Visual';
    case 'style': return 'Gaya Seni';
    default: return 'Template';
  }
});

function matchQuery(item, q) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return (
    (item.name && item.name.toLowerCase().includes(lower)) ||
    (item.prompt && item.prompt.toLowerCase().includes(lower)) ||
    (item.badge && item.badge.toLowerCase().includes(lower))
  );
}

const filteredBackgrounds = computed(() => {
  return BACKGROUND_PRESETS.filter(item => matchQuery(item, presetSearchQuery.value));
});

const filteredCostumes = computed(() => {
  return COSTUME_PRESETS.filter(item => matchQuery(item, presetSearchQuery.value));
});

const filteredObjects = computed(() => {
  return OBJECT_PRESETS.filter(item => matchQuery(item, presetSearchQuery.value));
});

const filteredArtStyles = computed(() => {
  return ART_STYLES.filter(item => matchQuery(item, presetSearchQuery.value));
});

// AI State
const isGenerating = ref(false);
const aiResultImage = ref(props.initialAiImage || null);
const progressPercent = ref(15);
const currentProgressStep = ref('Menyiapkan koneksi ke AI Neural Server...');
let progressInterval = null;

// Tips rotation
const photoboothTips = [
  'Mengombinasikan template latar, kostum, dan objek memberikan hasil photobooth paling estetik!',
  'ByteDance SeaDream 5 Lite menjaga ekspresi wajah dan pose asli Anda tetap konsisten.',
  'Setelah ini, Anda dapat memilih bingkai strip photobooth 4-cut atau koran edisi khusus.'
];
const currentTipIndex = ref(0);
const currentTip = computed(() => photoboothTips[currentTipIndex.value]);

// Before/After Slider State
const viewMode = ref('split');
const sliderPosition = ref(50);
const sliderWrapRef = ref(null);

// Preset Handlers
function selectBackground(item) {
  selectedBackground.value = selectedBackground.value?.id === item.id ? null : item;
}

function selectCostume(item) {
  selectedCostume.value = selectedCostume.value?.id === item.id ? null : item;
}

function isObjectSelected(item) {
  return selectedObjects.value.some(o => o.id === item.id);
}

function getObjectSelectIndex(item) {
  const idx = selectedObjects.value.findIndex(o => o.id === item.id);
  return idx >= 0 ? `#${idx + 1}` : '';
}

function selectObject(item) {
  const exists = selectedObjects.value.some(o => o.id === item.id);
  if (exists) {
    selectedObjects.value = selectedObjects.value.filter(o => o.id !== item.id);
  } else {
    if (selectedObjects.value.length >= 5) {
      alert('Maksimal 5 objek/efek visual yang dapat dipilih secara bersamaan.');
      return;
    }
    selectedObjects.value.push(item);
  }
}

function removeObject(item) {
  selectedObjects.value = selectedObjects.value.filter(o => o.id !== item.id);
}

function selectArtStyle(item) {
  selectedArtStyle.value = selectedArtStyle.value?.id === item.id ? null : item;
}

function clearAllSelections() {
  selectedBackground.value = null;
  selectedCostume.value = null;
  selectedObjects.value = [];
  selectedArtStyle.value = null;
}

// Build unified prompt string for ByteDance SeaDream & AI instruction models
function buildPromptString() {
  const latar = selectedBackground.value ? selectedBackground.value.prompt : '';
  const kostum = selectedCostume.value ? selectedCostume.value.prompt : '';
  const objekList = selectedObjects.value.map(o => o.prompt).filter(Boolean);
  const style = selectedArtStyle.value ? selectedArtStyle.value.prompt : '';

  // Construct structured Indonesian high-precision instruction prompt
  const instructions = ['Dari foto ini'];

  if (latar) {
    instructions.push(`ubah latar belakang menjadi ${latar} tanpa mengubah pose orang-orang dalam foto ini`);
  }
  if (kostum) {
    instructions.push(`ubah pakaian menjadi ${kostum}, sesuaikan dengan pose yang ada`);
  }
  if (objekList.length > 0) {
    instructions.push(`tambahkan objek ${objekList.join(', serta ')}`);
  }
  if (style) {
    instructions.push(`terapkan nuansa visual ${style}`);
  }

  instructions.push('WAJIB, tidak bisa ditawar, pose orang jangan diubah sama sekali, begitu juga dengan muka dan mimik wajah orang dalam foto.');

  return instructions.join('. ') + '.';
}

// Run AI Generation
async function runAiGeneration() {
  if (
    !selectedBackground.value &&
    !selectedCostume.value &&
    selectedObjects.value.length === 0 &&
    !selectedArtStyle.value
  ) {
    alert('Mohon pilih setidaknya 1 template gaya (Latar Belakang, Kostum, Objek, atau Gaya Seni) di sebelah kanan sebelum generate.');
    return;
  }

  isGenerating.value = true;
  progressPercent.value = 8;
  currentProgressStep.value = '1/4: Menyiapkan dan mengunggah foto ke Neural CDN...';

  let secondsElapsed = 0;
  progressInterval = setInterval(() => {
    secondsElapsed++;
    
    if (secondsElapsed < 6) {
      progressPercent.value = 15;
      currentProgressStep.value = '1/4: Mengunggah foto ke Replicate Neural CDN...';
    } else if (secondsElapsed < 18) {
      progressPercent.value = Math.min(45, 15 + (secondsElapsed - 6) * 2.5);
      currentProgressStep.value = '2/4: ByteDance SeaDream 5 Lite sedang memproses instruksi visual...';
    } else if (secondsElapsed < 38) {
      progressPercent.value = Math.min(80, 45 + (secondsElapsed - 18) * 1.8);
      currentProgressStep.value = '3/4: Mengubah latar & kostum sambil mempertahankan wajah asli...';
    } else if (secondsElapsed < 58) {
      progressPercent.value = Math.min(94, 80 + (secondsElapsed - 38) * 0.8);
      currentProgressStep.value = '4/4: Merender resolusi tinggi 2K & pencahayaan photobooth...';
    }
  }, 1000);

  const fullPrompt = buildPromptString();

  try {
    const result = await replicateService.generateImage({
      image: props.originalImage,
      prompt: fullPrompt,
      aspect_ratio: '16:9',
      strength: creativityStrength.value
    });

    clearInterval(progressInterval);
    progressPercent.value = 100;
    currentProgressStep.value = 'Foto Berhasil Ditransformasi! ✨';

    setTimeout(() => {
      aiResultImage.value = result.resultUrl;
      isGenerating.value = false;
      emit('ai-completed', {
        resultUrl: result.resultUrl,
        prompt: fullPrompt,
        isDemo: result.isDemo
      });
    }, 400);

  } catch (error) {
    clearInterval(progressInterval);
    isGenerating.value = false;
    alert('Terjadi kesalahan saat memproses AI: ' + error.message);
  }
}

// Slider Drag Handler
function handleSliderMove(e) {
  if (!sliderWrapRef.value) return;
  const rect = sliderWrapRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
  sliderPosition.value = percent;
}

function handleSliderTouch(e) {
  if (!sliderWrapRef.value || !e.touches[0]) return;
  const rect = sliderWrapRef.value.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left;
  const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
  sliderPosition.value = percent;
}

function proceedToDownload() {
  emit('go-next');
}

onMounted(() => {
  // Rotate tip every 4s
  const tipInterval = setInterval(() => {
    currentTipIndex.value = (currentTipIndex.value + 1) % photoboothTips.length;
  }, 4000);

  onUnmounted(() => {
    clearInterval(tipInterval);
    if (progressInterval) clearInterval(progressInterval);
  });
});
</script>

<style scoped>
.step2-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 20px 60px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.step-header-text {
  text-align: center;
  margin-bottom: 24px;
  width: 100%;
}

.step-badges-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 6px;
  width: 100%;
}

.cursor-pointer {
  cursor: pointer;
  transition: transform 0.15s;
}

.cursor-pointer:hover {
  transform: scale(1.05);
}

.step-title {
  font-size: 30px;
  font-weight: 800;
  margin: 8px 0 6px;
  color: var(--text-primary);
}

.step-desc {
  color: var(--text-secondary);
  font-size: 14px;
  max-width: 600px;
  margin: 0 auto;
}

/* Studio Grid Layout */
.studio-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 20px;
  align-items: start;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

/* Left Column - Preview */
.studio-preview-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.preview-panel {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 440px;
  background: #ffffff;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.single-image-wrap {
  position: relative;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.main-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-floating-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  color: var(--text-primary);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
}

.image-floating-badge.badge-ai {
  background: var(--accent-primary);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* Generating State */
.generating-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 16px;
  width: 100%;
  max-width: 100%;
}

.ai-orb-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.ai-orb {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--grad-primary);
  box-shadow: 0 0 30px rgba(79, 70, 229, 0.5);
  animation: orbPulse 2s infinite ease-in-out;
}

.ai-orb-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border-radius: 50%;
  border: 2px dashed #0284c7;
  animation: spin 6s linear infinite;
}

@keyframes orbPulse {
  0%, 100% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; filter: drop-shadow(0 0 15px #818cf8); }
}

.generating-title {
  font-size: 18px;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.generating-sub {
  color: var(--text-muted);
  font-size: 12px;
  margin-bottom: 16px;
}

.generation-progress-bar {
  width: 100%;
  max-width: 300px;
  height: 8px;
  background: #e2e8f0;
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--grad-cyber);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.progress-step-text {
  font-size: 12px;
  color: var(--accent-primary);
  font-weight: 700;
  margin-bottom: 16px;
}

.generating-tip-box {
  background: #f8fafc;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
}

.tip-icon {
  font-size: 16px;
}

.tip-text {
  font-size: 11px;
  color: var(--text-secondary);
  text-align: left;
  line-height: 1.4;
}

/* Result Before/After Split Slider */
.result-slider-container {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.view-mode-bar {
  display: flex;
  gap: 6px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: var(--radius-md);
  align-self: center;
}

.view-mode-btn {
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.view-mode-btn.active {
  background: #ffffff;
  color: var(--accent-primary);
  box-shadow: var(--shadow-sm);
}

.split-slider-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: ew-resize;
  user-select: none;
  box-shadow: var(--shadow-md);
  touch-action: none;
}

.slider-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slider-clip {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 2;
  border-right: 2px solid #ffffff;
}

.slider-clip .slider-img {
  width: auto;
  min-width: 100%;
  height: 100%;
}

.slider-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.handle-pill {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffffff;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}

.slider-tag {
  position: absolute;
  bottom: 10px;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 700;
  backdrop-filter: blur(8px);
  z-index: 3;
}

.left-tag {
  left: 10px;
  background: rgba(15, 23, 42, 0.75);
  color: #ffffff;
}

.right-tag {
  right: 10px;
  background: rgba(79, 70, 229, 0.85);
  color: #ffffff;
}

/* Actions Under Preview */
.studio-bottom-actions {
  width: 100%;
}

.generate-action-btn {
  width: 100%;
}

.completed-actions-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.completed-actions-row .btn {
  flex: 1;
}

/* Right Column - Controls */
.studio-controls-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

/* Active Selection Box */
.active-selection-box {
  padding: 16px;
  background: #ffffff;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.box-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.box-icon {
  font-size: 16px;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 32px;
  align-items: center;
  width: 100%;
}

.preset-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  max-width: 100%;
}

.bg-chip { background: #e0e7ff; color: #4338ca; border: 1px solid #c7d2fe; }
.costume-chip { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
.object-chip { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
.style-chip { background: #d1fae5; color: #047857; border: 1px solid #a7f3d0; }

.chip-remove {
  background: none;
  border: none;
  color: inherit;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  padding: 0 2px;
}

.empty-chips-text {
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
}

/* Category Tabs & Presets */
.presets-container {
  padding: 16px;
  background: #ffffff;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.preset-category-tabs {
  display: flex;
  gap: 6px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: var(--radius-md);
  margin-bottom: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  max-width: 100%;
}

.cat-tab {
  flex: 0 0 auto;
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  background: none;
  border: none;
  color: var(--text-secondary);
  font-family: var(--font-main);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.cat-tab:hover {
  color: var(--text-primary);
}

.cat-tab.active {
  background: #ffffff;
  color: var(--accent-primary);
  box-shadow: var(--shadow-sm);
  font-weight: 700;
}

.preset-search-wrap {
  position: relative;
  margin-bottom: 12px;
  width: 100%;
}

.preset-search-input {
  width: 100%;
  font-size: 12px;
  padding: 8px 30px 8px 12px;
  border-radius: var(--radius-sm);
  background: #f8fafc;
  border: 1px solid var(--border-medium);
}

.preset-search-input:focus {
  background: #ffffff;
  border-color: var(--accent-primary);
}

.btn-clear-search {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 50%;
}

.btn-clear-search:hover {
  color: var(--text-primary);
}

.no-presets-found {
  padding: 30px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  background: #f8fafc;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-subtle);
}

.multi-select-info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: var(--radius-sm);
  margin-bottom: 10px;
}

.multi-select-title {
  font-size: 11px;
  font-weight: 600;
  color: #0369a1;
}

.multi-select-count-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: #e0f2fe;
  color: #0284c7;
  border: 1px solid #7dd3fc;
}

.multi-select-count-badge.count-max {
  background: #fef3c7;
  color: #b45309;
  border-color: #fde68a;
}

.presets-grid-wrapper {
  width: 100%;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 4px;
  width: 100%;
  scrollbar-width: thin;
}

.preset-item-card {
  background: #f8fafc;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.preset-item-card:hover {
  background: #f1f5f9;
  border-color: var(--border-medium);
  transform: translateY(-1px);
}

.preset-item-card.selected {
  background: #eef2ff;
  border-color: var(--accent-primary);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
}

.preset-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preset-icon {
  font-size: 18px;
}

.preset-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  word-break: break-word;
}

/* ==========================================================================
   MOBILE SCREEN OPTIMIZATION (< 900px and < 600px)
   ========================================================================== */
@media (max-width: 900px) {
  .step2-container {
    padding: 14px 10px 40px;
  }

  .studio-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .preview-panel {
    min-height: auto;
    padding: 10px;
  }

  .preset-category-tabs {
    padding: 3px;
    gap: 3px;
  }

  .cat-tab {
    padding: 6px 10px;
    font-size: 11px;
  }

  .presets-grid {
    grid-template-columns: repeat(2, 1fr);
    max-height: 220px;
    gap: 6px;
  }

  .completed-actions-row {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .step-title {
    font-size: 20px;
  }

  .step-desc {
    font-size: 12px;
  }

  .presets-container, .active-selection-box {
    padding: 12px 10px;
  }

  .preset-item-card {
    padding: 8px;
  }

  .preset-name {
    font-size: 11px;
  }
}
</style>
