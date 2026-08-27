<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-card settings-card" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="modal-header-left">
          <span class="settings-icon">⚙️</span>
          <div>
            <h3>Pengaturan Model AI & API Token</h3>
            <p class="modal-sub">Pilih model AI, pantau statistik frekuensi pemakaian, dan konfigurasi API token.</p>
          </div>
        </div>
        <button class="btn btn-secondary btn-icon btn-sm" @click="$emit('close')">×</button>
      </div>

      <!-- Settings Navigation Tabs -->
      <div class="modal-tabs">
        <button 
          class="modal-tab-btn" 
          :class="{ active: activeTab === 'models' }"
          @click="activeTab = 'models'"
        >
          <span>🚀 Pemilihan Model AI</span>
        </button>
        <button 
          class="modal-tab-btn" 
          :class="{ active: activeTab === 'stats' }"
          @click="fetchStats(); activeTab = 'stats'"
        >
          <span>📊 Statistik Penggunaan ({{ statsData.totalGenerations || 0 }})</span>
        </button>
        <button 
          class="modal-tab-btn" 
          :class="{ active: activeTab === 'token' }"
          @click="activeTab = 'token'"
        >
          <span>🔑 Token API</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- ================= TAB 1: PEMILIHAN MODEL AI ================= -->
        <div v-if="activeTab === 'models'" class="tab-pane">
          <div class="section-intro">
            <span class="section-title">Pilih Model AI yang Ingin Digunakan:</span>
            <p class="section-desc">Secara bawaan (*default*), sistem akan otomatis memilih model yang paling jarang dipakai untuk membagi beban kerja secara merata.</p>
          </div>

          <!-- Auto Option (Least Used - Default) -->
          <div 
            class="model-option-card auto-card" 
            :class="{ selected: selectedModel === 'auto' }"
            @click="selectedModel = 'auto'"
          >
            <div class="model-card-radio">
              <input type="radio" value="auto" v-model="selectedModel" />
            </div>
            <span class="model-opt-icon">🤖</span>
            <div class="model-opt-info">
              <div class="model-opt-header">
                <span class="model-opt-name">Otomatis (Paling Jarang Dipakai)</span>
                <span class="badge badge-emerald">Default Rekomendasi</span>
              </div>
              <p class="model-opt-desc">
                Sistem otomatis memilih model dengan frekuensi pemakaian paling rendah saat tombol transformasi ditekan.
              </p>
              <div class="current-least-badge" v-if="statsData.leastUsedModelName">
                <span>Saat ini akan menggunakan: <strong>{{ statsData.leastUsedModelName }}</strong></span>
              </div>
            </div>
          </div>

          <div class="model-divider-text">
            <span>Atau pilih model spesifik secara manual:</span>
          </div>

          <!-- Specific Models List -->
          <div class="models-grid">
            <div 
              v-for="m in AVAILABLE_MODELS" 
              :key="m.id"
              class="model-option-card"
              :class="{ selected: selectedModel === m.id }"
              @click="selectedModel = m.id"
            >
              <div class="model-card-radio">
                <input type="radio" :value="m.id" v-model="selectedModel" />
              </div>
              <span class="model-opt-icon">{{ m.icon }}</span>
              <div class="model-opt-info">
                <div class="model-opt-header">
                  <span class="model-opt-name">{{ m.name }}</span>
                  <span class="badge badge-primary">{{ m.tag }}</span>
                </div>
                <p class="model-opt-desc">{{ m.description }}</p>
                <div class="model-meta-row">
                  <span class="meta-provider">Provider: {{ m.provider }}</span>
                  <span class="meta-count">Dipakai: {{ getModelCount(m.id) }}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= TAB 2: STATISTIK PENGGUNAAN MODEL ================= -->
        <div v-if="activeTab === 'stats'" class="tab-pane">
          <!-- Summary Metrics -->
          <div class="stats-metric-row">
            <div class="metric-box">
              <span class="metric-val">{{ statsData.totalGenerations || 0 }}</span>
              <span class="metric-lbl">Total Foto Ditransformasikan</span>
            </div>
            <div class="metric-box highlight-box">
              <span class="metric-val">{{ statsData.leastUsedModelName || 'Semua Seimbang' }}</span>
              <span class="metric-lbl">Model Paling Jarang Dipakai</span>
            </div>
          </div>

          <!-- Refresh & Reset Toolbar -->
          <div class="stats-toolbar">
            <span class="stats-toolbar-title">Rincian Penggunaan Tiap Model:</span>
            <div class="stats-toolbar-actions">
              <button class="btn btn-secondary btn-sm" @click="fetchStats" :disabled="isLoadingStats">
                {{ isLoadingStats ? 'Memuat...' : '🔄 Segarkan' }}
              </button>
              <button class="btn btn-danger btn-sm" @click="confirmResetStats">
                🗑️ Reset Statistik
              </button>
            </div>
          </div>

          <!-- Detailed Stats List -->
          <div class="model-stats-list">
            <div 
              v-for="m in statsData.models || []" 
              :key="m.id" 
              class="model-stat-item"
              :class="{ 'least-used-item': m.isLeastUsed }"
            >
              <div class="stat-item-top">
                <div class="stat-item-left">
                  <span class="stat-icon">{{ m.icon || '🚀' }}</span>
                  <div>
                    <h5 class="stat-name">{{ m.name }}</h5>
                    <span class="stat-provider">{{ m.provider }} • {{ m.description }}</span>
                  </div>
                </div>
                <div class="stat-item-right">
                  <span class="stat-count-num">{{ m.count }} <small>kali</small></span>
                  <span v-if="m.isLeastUsed" class="badge badge-emerald">Paling Jarang ⭐</span>
                </div>
              </div>

              <!-- Percentage Bar -->
              <div class="stat-progress-wrap">
                <div class="stat-progress-bar">
                  <div class="stat-progress-fill" :style="{ width: m.percentage }"></div>
                </div>
                <span class="stat-pct-text">{{ m.percentage }}</span>
              </div>

              <div class="stat-footer-text">
                <span>Terakhir dipakai: <strong>{{ formatTime(m.lastUsed) }}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= TAB 3: TOKEN API & SIMULATOR ================= -->
        <div v-if="activeTab === 'token'" class="tab-pane">
          <!-- Token Input -->
          <div class="form-group">
            <div class="label-row">
              <label class="form-label">Replicate API Token (API Key)</label>
              <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener" class="token-link">
                Dapatkan Token Replicate ↗
              </a>
            </div>
            <div class="input-with-btn">
              <input 
                :type="showToken ? 'text' : 'password'" 
                v-model="tokenInput" 
                class="form-input font-mono"
                placeholder="r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
              />
              <button class="btn btn-secondary btn-sm" @click="showToken = !showToken">
                {{ showToken ? 'Sembunyikan' : 'Lihat' }}
              </button>
            </div>
            <p class="field-hint">
              Token Anda disimpan di browser local storage laptop ini dan tidak dibagikan ke pihak ketiga.
            </p>
          </div>

          <!-- Simulator / Demo Mode Notice -->
          <div class="demo-mode-card">
            <div class="demo-card-header">
              <span class="demo-icon">✨</span>
              <div class="demo-card-text">
                <h5>Mode AI Simulator Bawaan Tetap Siap</h5>
                <p>Jika token Replicate tidak diisi atau kuota habis, aplikasi otomatis menggunakan AI Style Simulator sehingga Photobooth tetap dapat berfungsi dan didemokan tanpa gangguan.</p>
              </div>
            </div>
          </div>

          <!-- Connection Test Status Alert -->
          <div v-if="testStatus" class="test-status-alert" :class="testStatus.type">
            <span>{{ testStatus.message }}</span>
          </div>

          <div class="mt-3">
            <button class="btn btn-secondary" @click="testConnection" :disabled="isTesting">
              {{ isTesting ? 'Menguji...' : '🔌 Tes Koneksi Server & Token' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Batal</button>
        <button class="btn btn-primary" @click="saveSettings">
          💾 Simpan Pengaturan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AVAILABLE_MODELS } from '../data/modelsData.js';
import { replicateService } from '../services/replicateService.js';
import axios from 'axios';

const emit = defineEmits(['close', 'saved']);

const activeTab = ref('models');
const tokenInput = ref('');
const selectedModel = ref('auto');
const showToken = ref(false);
const isTesting = ref(false);
const testStatus = ref(null);
const isLoadingStats = ref(false);

const statsData = ref({
  totalGenerations: 0,
  leastUsedModel: 'bytedance/seedream-5-lite',
  leastUsedModelName: 'ByteDance SeaDream 5 Lite',
  models: []
});

function loadSettings() {
  tokenInput.value = replicateService.getToken();
  selectedModel.value = replicateService.getModel();
  fetchStats();
}

async function fetchStats() {
  isLoadingStats.value = true;
  try {
    const data = await replicateService.getModelStats();
    statsData.value = data;
  } catch (e) {
    console.error('Failed to fetch model stats:', e);
  } finally {
    isLoadingStats.value = false;
  }
}

function getModelCount(modelId) {
  const found = statsData.value.models?.find(m => m.id === modelId);
  return found ? found.count : 0;
}

function formatTime(isoString) {
  if (!isoString) return 'Belum pernah';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
}

async function confirmResetStats() {
  if (confirm('Apakah Anda yakin ingin mereset seluruh statistik pemakaian model ke 0?')) {
    try {
      await replicateService.resetModelStats();
      await fetchStats();
      alert('Statistik berhasil direset.');
    } catch (e) {
      alert('Gagal mereset statistik.');
    }
  }
}

async function testConnection() {
  isTesting.value = true;
  testStatus.value = null;

  try {
    const res = await axios.get('/api/info');
    if (tokenInput.value.trim().length > 10) {
      testStatus.value = {
        type: 'success',
        message: `✅ Server lokal terhubung (IP: ${res.data.localIp}). Token Replicate siap digunakan!`
      };
    } else {
      testStatus.value = {
        type: 'warning',
        message: `ℹ️ Server lokal aktif (IP: ${res.data.localIp}). Mode Simulator aktif karena token kosong.`
      };
    }
  } catch (e) {
    testStatus.value = {
      type: 'warning',
      message: 'ℹ️ Mode frontend standalone aktif.'
    };
  } finally {
    isTesting.value = false;
  }
}

function saveSettings() {
  replicateService.saveToken(tokenInput.value);
  replicateService.saveModel(selectedModel.value);
  emit('saved');
  emit('close');
}

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.settings-card {
  max-width: 720px;
  background: #ffffff;
}

.settings-icon {
  font-size: 24px;
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
  gap: 12px;
}

.modal-header-left h3 {
  font-size: 18px;
  color: var(--text-primary);
}

.modal-sub {
  font-size: 12px;
  color: var(--text-muted);
}

/* Tabs */
.modal-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-subtle);
  background: #f8fafc;
}

.modal-tab-btn {
  flex: 1;
  padding: 12px 14px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
}

.modal-tab-btn.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
  background: #ffffff;
}

.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 68vh;
  overflow-y: auto;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: fadeIn 0.2s ease;
}

.section-intro {
  margin-bottom: 4px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
}

.section-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* Model Option Cards */
.model-option-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f8fafc;
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.model-option-card:hover {
  background: #f1f5f9;
  border-color: var(--border-medium);
}

.model-option-card.selected {
  background: #eef2ff;
  border-color: var(--accent-primary);
  box-shadow: 0 2px 10px rgba(79, 70, 229, 0.12);
}

.auto-card {
  border: 2px solid #a5b4fc;
  background: #f8faff;
}

.model-card-radio {
  margin-top: 2px;
}

.model-card-radio input {
  accent-color: var(--accent-primary);
  cursor: pointer;
}

.model-opt-icon {
  font-size: 22px;
}

.model-opt-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.model-opt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.model-opt-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.model-opt-desc {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.35;
}

.current-least-badge {
  font-size: 11px;
  color: #047857;
  background: #d1fae5;
  padding: 3px 8px;
  border-radius: 6px;
  margin-top: 4px;
  display: inline-block;
  width: fit-content;
}

.model-divider-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  margin: 4px 0;
}

.models-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.model-meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 4px;
}

/* Statistics Tab Styles */
.stats-metric-row {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 10px;
}

.metric-box {
  background: #f8fafc;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-box.highlight-box {
  background: #eef2ff;
  border-color: #c7d2fe;
}

.metric-val {
  font-size: 18px;
  font-weight: 800;
  color: var(--accent-primary);
}

.metric-lbl {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
}

.stats-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.stats-toolbar-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
}

.stats-toolbar-actions {
  display: flex;
  gap: 6px;
}

.model-stats-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.model-stat-item {
  background: #f8fafc;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.model-stat-item.least-used-item {
  border: 1.5px solid #10b981;
  background: #f0fdf4;
}

.stat-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  font-size: 20px;
}

.stat-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-provider {
  font-size: 11px;
  color: var(--text-muted);
  display: block;
}

.stat-item-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.stat-count-num {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-primary);
}

.stat-count-num small {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
}

.stat-progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-progress-bar {
  flex: 1;
  height: 7px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.stat-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.least-used-item .stat-progress-fill {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.stat-pct-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  width: 40px;
  text-align: right;
}

.stat-footer-text {
  font-size: 10px;
  color: var(--text-muted);
}

/* Token Tab */
.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.token-link {
  font-size: 12px;
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 600;
}

.token-link:hover {
  text-decoration: underline;
}

.input-with-btn {
  display: flex;
  gap: 8px;
}

.font-mono {
  font-family: var(--font-mono);
}

.field-hint {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 6px;
}

.demo-mode-card {
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: var(--radius-md);
  padding: 14px;
}

.demo-card-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.demo-icon {
  font-size: 20px;
}

.demo-card-text h5 {
  font-size: 13px;
  color: var(--accent-primary);
  margin-bottom: 4px;
  font-weight: 700;
}

.demo-card-text p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.test-status-alert {
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
}

.test-status-alert.success {
  background: #d1fae5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.test-status-alert.warning {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.mt-3 {
  margin-top: 12px;
}

@media (max-width: 600px) {
  .modal-header {
    padding: 14px 16px;
  }

  .modal-body {
    padding: 14px 16px;
    gap: 14px;
  }

  .modal-tabs {
    flex-direction: column;
  }

  .modal-tab-btn {
    padding: 8px 12px;
    font-size: 12px;
  }

  .stats-metric-row {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    padding: 12px 16px;
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
  }

  .input-with-btn {
    flex-direction: column;
  }
}
</style>
