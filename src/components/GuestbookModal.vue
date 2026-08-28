<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-card guestbook-card" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-header-left">
          <span class="header-icon">📖</span>
          <div>
            <h3>Buku Tamu & Kuesioner Riset Test</h3>
            <p class="modal-sub">Data pengunjung, minat prodi, dan hasil kuesioner kualitas & creative marketing</p>
          </div>
        </div>
        <button class="btn btn-secondary btn-icon btn-sm" @click="$emit('close')">×</button>
      </div>

      <!-- Tab Navigation -->
      <div class="modal-tabs">
        <button 
          class="modal-tab-btn" 
          :class="{ active: activeTab === 'guests' }"
          @click="activeTab = 'guests'"
        >
          <span>👥 Buku Tamu & Kontak ({{ stats.total }})</span>
        </button>
        <button 
          class="modal-tab-btn" 
          :class="{ active: activeTab === 'questionnaires' }"
          @click="activeTab = 'questionnaires'"
        >
          <span>📋 Hasil Kuesioner ({{ questionnaireData.total }})</span>
        </button>
        <button 
          class="modal-tab-btn" 
          :class="{ active: activeTab === 'models' }"
          @click="activeTab = 'models'"
        >
          <span>🤖 Statistik Model AI ({{ modelStatsData.totalGenerations || 0 }})</span>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- TAB 1: GUESTS LIST -->
        <div v-if="activeTab === 'guests'" class="tab-content">
          <!-- Metric Cards -->
          <div class="stats-row">
            <div class="stat-card">
              <span class="stat-num">{{ stats.total }}</span>
              <span class="stat-label">Total Pengunjung</span>
            </div>
            <div class="stat-card stat-gold">
              <span class="stat-num">★ {{ stats.avgRating }}</span>
              <span class="stat-label">Rata-Rata Rating</span>
            </div>
            <div class="stat-card">
              <div class="prodi-mini-bar">
                <span class="prodi-pill prodi-inf">IT: {{ stats.prodiCounts?.informatika || 0 }}</span>
                <span class="prodi-pill prodi-mgt">MGT: {{ stats.prodiCounts?.manajemen || 0 }}</span>
                <span class="prodi-pill prodi-kep">KEP: {{ stats.prodiCounts?.keperawatan || 0 }}</span>
              </div>
              <span class="stat-label">Peminatan Prodi</span>
            </div>
          </div>

          <!-- Filter & Export Toolbar -->
          <div class="guestbook-toolbar">
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-input search-input" 
              placeholder="🔍 Cari nama, prodi, nomor HP, email..." 
            />
            <button class="btn btn-gold btn-sm" @click="exportCsv" :disabled="filteredGuests.length === 0">
              📥 Ekspor CSV Tamu
            </button>
          </div>

          <!-- Guests List -->
          <div class="guest-list-container">
            <div v-if="isLoading" class="loading-state">
              <div class="spinner"></div>
              <span>Memuat data buku tamu...</span>
            </div>

            <div v-else-if="filteredGuests.length === 0" class="empty-state">
              <span class="empty-icon">📝</span>
              <p>Belum ada data pengunjung yang tercatat.</p>
            </div>

            <div v-else class="guest-cards-grid">
              <div v-for="g in filteredGuests" :key="g.id || g.timestamp" class="guest-card-item">
                <div class="guest-card-top">
                  <div class="guest-info">
                    <div class="name-row">
                      <h5 class="guest-name">{{ g.name }}</h5>
                      <span class="badge badge-primary badge-sm">{{ g.prodiName || 'Teknik Informatika' }}</span>
                    </div>
                    <span class="guest-time">{{ formatTime(g.timestamp || g.createdAt) }}</span>
                  </div>
                  <div class="guest-rating">
                    <span class="star-badge">★ {{ g.rating }} / 5</span>
                  </div>
                </div>

                <div class="guest-contacts">
                  <span v-if="g.age" class="contact-pill">🎂 {{ g.age }} Tahun</span>
                  <span v-if="g.gender" class="contact-pill">{{ g.gender === 'Perempuan' ? '👩' : '👨' }} {{ g.gender }}</span>
                  <span class="contact-pill">📱 {{ g.phone }}</span>
                  <span class="contact-pill">✉️ {{ g.email }}</span>
                </div>

                <p class="guest-comment">
                  "{{ g.feedback || 'Tidak ada komentar tertulis.' }}"
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: QUESTIONNAIRES RESEARCH RESULTS -->
        <div v-if="activeTab === 'questionnaires'" class="tab-content">
          <!-- Research Scores Row -->
          <div class="q-stats-grid">
            <div class="q-stat-card">
              <span class="q-stat-val">{{ questionnaireData.stats?.avgFace || '5.0' }} / 5</span>
              <span class="q-stat-title">Kemiripan Wajah (Q1)</span>
              <span class="q-stat-sub">Rata-rata Skor</span>
            </div>
            <div class="q-stat-card">
              <span class="q-stat-val">{{ questionnaireData.stats?.avgPose || '5.0' }} / 5</span>
              <span class="q-stat-title">Kemiripan Pose (Q2)</span>
              <span class="q-stat-sub">Rata-rata Skor</span>
            </div>
            <div class="q-stat-card">
              <span class="q-stat-val">{{ questionnaireData.stats?.avgKeyword || '5.0' }} / 5</span>
              <span class="q-stat-title">Kesesuaian Keyword (Q3)</span>
              <span class="q-stat-sub">Rata-rata Skor</span>
            </div>
            <div class="q-stat-card">
              <span class="q-stat-val">{{ questionnaireData.stats?.avgMarketing || '5.0' }} / 5</span>
              <span class="q-stat-title">Keseruan Brosur (Q4)</span>
              <span class="q-stat-sub">AI Photobooth</span>
            </div>
          </div>

          <!-- Brochure Preference Highlight Box (Q5) -->
          <div class="preference-box">
            <div class="pref-header">
              <span class="pref-badge">💡 PERTANYAAN PILIHAN BROSUR (Q5)</span>
              <h4>Preferensi: Brosur Kreatif Interaktif vs Brosur Fisik</h4>
            </div>
            <div class="pref-bar-wrap">
              <div class="pref-bar">
                <div class="pref-fill-kreatif" :style="{ width: (questionnaireData.stats?.percentageKreatif || 100) + '%' }"></div>
              </div>
              <div class="pref-labels">
                <span class="pref-kreatif">✨ Brosur Kreatif AI: <strong>{{ questionnaireData.stats?.percentageKreatif || 100 }}%</strong> ({{ questionnaireData.stats?.preferenceCounts?.brosur_kreatif || 0 }} responden)</span>
                <span class="pref-fisik">📄 Brosur Fisik: <strong>{{ (100 - (questionnaireData.stats?.percentageKreatif || 100)).toFixed(1) }}%</strong> ({{ questionnaireData.stats?.preferenceCounts?.brosur_fisik || 0 }} responden)</span>
              </div>
            </div>
          </div>

          <!-- Export Toolbar -->
          <div class="guestbook-toolbar">
            <span class="text-sm font-semibold text-secondary">Daftar {{ questionnaireData.total }} Tanggapan Responden:</span>
            <a href="/api/questionnaires/export" class="btn btn-emerald btn-sm" download>
              📥 Ekspor CSV Kuesioner
            </a>
          </div>

          <!-- Questionnaire Response List -->
          <div class="guest-list-container">
            <div v-if="questionnaireData.responses?.length === 0" class="empty-state">
              <span class="empty-icon">📊</span>
              <p>Belum ada tanggapan kuesioner yang tercatat.</p>
            </div>

            <div v-else class="q-responses-table-wrap">
              <table class="q-table">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Wajah (Q1)</th>
                    <th>Pose (Q2)</th>
                    <th>Keyword (Q3)</th>
                    <th>Keseruan (Q4)</th>
                    <th>Preferensi Brosur (Q5)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in questionnaireData.responses" :key="r.id">
                    <td class="font-mono text-xs">{{ formatTime(r.createdAt) }}</td>
                    <td><span class="badge badge-emerald">{{ r.q1_face }} ★</span></td>
                    <td><span class="badge badge-emerald">{{ r.q2_pose }} ★</span></td>
                    <td><span class="badge badge-emerald">{{ r.q3_keyword }} ★</span></td>
                    <td><span class="badge badge-amber">{{ r.q4_marketing }} ★</span></td>
                    <td>
                      <span v-if="r.q5_brochure_preference === 'brosur_kreatif'" class="badge badge-primary">✨ Brosur Kreatif</span>
                      <span v-else class="badge badge-secondary">📄 Brosur Fisik</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 3: AI MODEL USAGE STATS -->
        <div v-if="activeTab === 'models'" class="tab-content">
          <div class="stats-row">
            <div class="stat-card">
              <span class="stat-num">{{ modelStatsData.totalGenerations || 0 }}</span>
              <span class="stat-label">Total Transformasi AI</span>
            </div>
            <div class="stat-card stat-gold">
              <span class="stat-num">{{ modelStatsData.leastUsedModelName || 'Semua Seimbang' }}</span>
              <span class="stat-label">Model Paling Jarang Dipakai (Next)</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">4</span>
              <span class="stat-label">Model AI Terintegrasi</span>
            </div>
          </div>

          <div class="guest-list-container">
            <div class="model-stat-cards-grid">
              <div 
                v-for="m in modelStatsData.models || []" 
                :key="m.id" 
                class="guest-card-item"
                :class="{ 'least-used-card': m.isLeastUsed }"
              >
                <div class="guest-card-top">
                  <div class="guest-info">
                    <div class="name-row">
                      <span class="model-avatar">{{ m.icon }}</span>
                      <h5 class="guest-name">{{ m.name }}</h5>
                      <span v-if="m.isLeastUsed" class="badge badge-emerald badge-sm">Paling Jarang ⭐</span>
                    </div>
                    <span class="guest-time">{{ m.provider }} • {{ m.description }}</span>
                  </div>
                  <div class="guest-rating">
                    <span class="star-badge">{{ m.count }}x Dipakai</span>
                  </div>
                </div>

                <div class="stat-progress-wrap mt-2">
                  <div class="stat-progress-bar">
                    <div class="stat-progress-fill" :style="{ width: m.percentage }"></div>
                  </div>
                  <span class="stat-pct-text">{{ m.percentage }}</span>
                </div>

                <div class="guest-contacts mt-2">
                  <span class="contact-pill">🕒 Terakhir: {{ formatTime(m.lastUsed) || 'Belum pernah' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { guestService } from '../services/guestService.js';
import { replicateService } from '../services/replicateService.js';

const emit = defineEmits(['close']);

const activeTab = ref('guests');
const isLoading = ref(true);
const searchQuery = ref('');

const stats = ref({
  total: 0,
  avgRating: '5.0',
  starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  prodiCounts: { informatika: 0, manajemen: 0, keperawatan: 0 },
  guests: []
});

const questionnaireData = ref({
  total: 0,
  stats: {
    avgFace: '5.0',
    avgPose: '5.0',
    avgKeyword: '5.0',
    avgMarketing: '5.0',
    preferenceCounts: { brosur_kreatif: 0, brosur_fisik: 0 },
    percentageKreatif: '100.0'
  },
  responses: []
});

const modelStatsData = ref({
  totalGenerations: 0,
  leastUsedModel: '',
  leastUsedModelName: '',
  models: []
});

const filteredGuests = computed(() => {
  if (!searchQuery.value.trim()) return stats.value.guests;
  const q = searchQuery.value.toLowerCase();
  return stats.value.guests.filter(g => 
    (g.name && g.name.toLowerCase().includes(q)) ||
    (g.phone && g.phone.toLowerCase().includes(q)) ||
    (g.email && g.email.toLowerCase().includes(q)) ||
    (g.prodiName && g.prodiName.toLowerCase().includes(q)) ||
    (g.feedback && g.feedback.toLowerCase().includes(q))
  );
});

async function loadData() {
  isLoading.value = true;
  try {
    const [guestList, qList, mStats] = await Promise.all([
      guestService.getGuestList(),
      guestService.getQuestionnaires(),
      replicateService.getModelStats()
    ]);
    stats.value = guestList;
    questionnaireData.value = qList;
    modelStatsData.value = mStats;
  } catch (e) {
    console.error('Failed to load guest / questionnaire data:', e);
  } finally {
    isLoading.value = false;
  }
}

function formatTime(isoString) {
  if (!isoString) return '';
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

function exportCsv() {
  guestService.exportCsv(filteredGuests.value);
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.guestbook-card {
  max-width: 820px;
  background: #ffffff;
}

.header-icon {
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
  padding: 12px 16px;
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
  max-height: 65vh;
  overflow-y: auto;
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: #f8fafc;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}

.stat-card.stat-gold {
  border-color: #fde68a;
  background: #fef3c7;
}

.stat-num {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
}

.stat-card.stat-gold .stat-num {
  color: #b45309;
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
}

.prodi-mini-bar {
  display: flex;
  gap: 4px;
}

.prodi-pill {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}
.prodi-inf { background: #e0f2fe; color: #0369a1; }
.prodi-mgt { background: #fef3c7; color: #b45309; }
.prodi-kep { background: #d1fae5; color: #047857; }

/* Questionnaire Stats Grid */
.q-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.q-stat-card {
  background: #f8fafc;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.q-stat-val {
  font-size: 18px;
  font-weight: 800;
  color: #059669;
}

.q-stat-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
}

.q-stat-sub {
  font-size: 10px;
  color: var(--text-muted);
}

/* Preference Box */
.preference-box {
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: var(--radius-md);
  padding: 14px 16px;
  margin-bottom: 12px;
}

.pref-badge {
  font-size: 10px;
  font-weight: 800;
  color: var(--accent-primary);
  letter-spacing: 0.5px;
}

.pref-header h4 {
  font-size: 13px;
  color: var(--text-primary);
  margin: 3px 0 10px;
}

.pref-bar {
  width: 100%;
  height: 10px;
  background: #cbd5e1;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 6px;
}

.pref-fill-kreatif {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5 0%, #059669 100%);
  border-radius: 10px;
  transition: width 0.4s ease;
}

.pref-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.pref-kreatif { color: #065f46; }
.pref-fisik { color: #475569; }

/* Toolbar */
.guestbook-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.search-input {
  max-width: 320px;
}

/* Guest Cards */
.guest-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.guest-card-item {
  background: #f8fafc;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 14px;
}

.guest-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.guest-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.guest-time {
  font-size: 11px;
  color: var(--text-muted);
}

.star-badge {
  font-size: 12px;
  font-weight: 700;
  color: #b45309;
  background: #fef3c7;
  padding: 3px 8px;
  border-radius: 20px;
  border: 1px solid #fde68a;
}

.guest-contacts {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.contact-pill {
  font-size: 11px;
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  padding: 3px 8px;
  border-radius: 6px;
  color: var(--text-secondary);
}

.guest-comment {
  font-size: 12px;
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Model Stats Tab Styles */
.model-stat-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.model-avatar {
  font-size: 20px;
}

.least-used-card {
  border: 1.5px solid #10b981;
  background: #f0fdf4;
}

.stat-progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-progress-bar {
  flex: 1;
  height: 8px;
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

.least-used-card .stat-progress-fill {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.stat-pct-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  width: 42px;
  text-align: right;
}

.mt-2 {
  margin-top: 8px;
}

/* Questionnaire Table */
.q-responses-table-wrap {
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.q-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: left;
}

.q-table th {
  background: #f1f5f9;
  padding: 10px 12px;
  color: var(--text-secondary);
  font-weight: 700;
  border-bottom: 1px solid var(--border-subtle);
}

.q-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-primary);
}

.q-table tr:hover td {
  background: #f8fafc;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  color: var(--text-muted);
  gap: 8px;
}

.empty-icon {
  font-size: 32px;
}

.modal-footer {
  padding: 14px 24px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 600px) {
  .modal-header {
    padding: 14px 16px;
  }

  .modal-body {
    padding: 14px 16px;
  }

  .stats-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .q-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .guestbook-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    max-width: 100%;
  }

  .modal-tabs {
    flex-direction: column;
  }

  .modal-tab-btn {
    padding: 10px 12px;
  }
}
</style>
