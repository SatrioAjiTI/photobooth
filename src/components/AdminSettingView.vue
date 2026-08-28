<template>
  <div class="admin-setting-page">
    <!-- Header Section -->
    <div class="admin-header-card glass-panel">
      <div class="header-left">
        <div class="header-badge">
          <span>⚙️ PANEL ADMINISTRATOR</span>
        </div>
        <h1 class="page-title">Pengaturan Sistem & Data Pengunjung</h1>
        <p class="page-desc">
          Kelola token Replicate AI, pantau statistik model, periksa buku tamu, analisis kuesioner riset, dan kelola riwayat data.
        </p>
      </div>

      <div class="header-right">
        <button class="btn btn-primary pulse-glow" @click="goBackToPhotobooth">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3.5"/>
          </svg>
          <span>Kembali ke Photobooth</span>
        </button>
      </div>
    </div>

    <!-- Main Navigation Tabs -->
    <div class="admin-tabs-bar glass-panel">
      <button 
        class="admin-tab-btn" 
        :class="{ active: currentTab === 'token' }"
        @click="currentTab = 'token'"
      >
        <span class="tab-icon">🔑</span>
        <span>Token & Model AI</span>
      </button>

      <button 
        class="admin-tab-btn" 
        :class="{ active: currentTab === 'prompts' }"
        @click="currentTab = 'prompts'"
      >
        <span class="tab-icon">🎨</span>
        <span>Template Prompt & Gaya</span>
      </button>

      <button 
        class="admin-tab-btn" 
        :class="{ active: currentTab === 'stats' }"
        @click="currentTab = 'stats'; fetchModelStats()"
      >
        <span class="tab-icon">📊</span>
        <span>Statistik Model ({{ modelStats.totalGenerations || 0 }})</span>
      </button>

      <button 
        class="admin-tab-btn" 
        :class="{ active: currentTab === 'guests' }"
        @click="currentTab = 'guests'; fetchGuests()"
      >
        <span class="tab-icon">👥</span>
        <span>Buku Tamu ({{ guestStats.total || 0 }})</span>
      </button>

      <button 
        class="admin-tab-btn" 
        :class="{ active: currentTab === 'questionnaires' }"
        @click="currentTab = 'questionnaires'; fetchQuestionnaires()"
      >
        <span class="tab-icon">📋</span>
        <span>Kuesioner Riset ({{ questionnaireStats.total || 0 }})</span>
      </button>

      <button 
        class="admin-tab-btn tab-danger" 
        :class="{ active: currentTab === 'reset' }"
        @click="currentTab = 'reset'"
      >
        <span class="tab-icon">🗑️</span>
        <span>Kosongkan Data</span>
      </button>
    </div>

    <!-- TAB 1: TOKEN & MODEL SELECTION -->
    <div v-if="currentTab === 'token'" class="tab-content-container">
      <div class="admin-grid-2">
        <!-- Card 1: API Token Configuration -->
        <div class="admin-card glass-panel">
          <div class="card-header">
            <span class="card-icon">🔑</span>
            <div>
              <h3>Replicate API Token</h3>
              <p class="card-subtitle">Kunci autentikasi untuk menjalankan generasi AI neural di cloud.</p>
            </div>
          </div>

          <div class="card-body">
            <!-- Active Status Indicator -->
            <div class="status-box" :class="hasValidToken ? 'status-active' : 'status-demo'">
              <div class="status-dot"></div>
              <div class="status-text">
                <strong>{{ hasValidToken ? 'Mode Live AI Aktif' : 'Mode Simulator Aktif' }}</strong>
                <span>{{ hasValidToken ? 'Token Replicate API terpasang & siap digunakan.' : 'Menggunakan mock engine berkecepatan tinggi.' }}</span>
              </div>
            </div>

            <!-- Token Input Field -->
            <div class="form-group mt-4">
              <label class="form-label">Masukkan API Token Replicate (<code>r8_...</code>)</label>
              <div class="input-with-action">
                <input 
                  :type="showToken ? 'text' : 'password'" 
                  v-model="tokenInput" 
                  class="form-input" 
                  placeholder="r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                />
                <button type="button" class="btn btn-secondary btn-sm" @click="showToken = !showToken">
                  {{ showToken ? 'Sembunyikan' : 'Lihat' }}
                </button>
              </div>
              <span class="input-hint">
                Dapatkan token gratis di <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener">replicate.com/account/api-tokens</a>
              </span>
            </div>

            <!-- Token Action Buttons -->
            <div class="action-buttons-row mt-4">
              <button class="btn btn-primary" @click="saveToken">
                💾 Simpan Token
              </button>
              <button class="btn btn-secondary" @click="testToken" :disabled="!tokenInput || isTestingToken">
                {{ isTestingToken ? 'Menguji...' : '⚡ Uji Koneksi API' }}
              </button>
              <button v-if="hasValidToken" class="btn btn-danger-outline" @click="removeToken">
                Hapus Token
              </button>
            </div>

            <div v-if="tokenFeedback" class="alert-box mt-3" :class="tokenFeedbackType">
              {{ tokenFeedback }}
            </div>
          </div>
        </div>

        <!-- Card 2: AI Model Selection -->
        <div class="admin-card glass-panel">
          <div class="card-header">
            <span class="card-icon">🤖</span>
            <div>
              <h3>Pilihan Model AI</h3>
              <p class="card-subtitle">Pilih model default atau aktifkan load balancer otomatis.</p>
            </div>
          </div>

          <div class="card-body">
            <div class="model-options-list">
              <!-- Option: Auto (Least Used) -->
              <div 
                class="model-select-card" 
                :class="{ selected: selectedModel === 'auto' }"
                @click="setModel('auto')"
              >
                <div class="radio-indicator">
                  <span v-if="selectedModel === 'auto'" class="radio-check">●</span>
                </div>
                <div class="model-select-info">
                  <div class="model-select-top">
                    <strong>🤖 Otomatis (Model Paling Jarang Dipakai)</strong>
                    <span class="badge badge-emerald">Default Rekomendasi</span>
                  </div>
                  <p>Sistem otomatis memilih model dengan beban terendah untuk pemerataan kuota dan latensi seimbang.</p>
                  <div class="least-used-preview" v-if="modelStats.leastUsedModelName">
                    <span>Target berikutnya: <strong>{{ modelStats.leastUsedModelName }}</strong></span>
                  </div>
                </div>
              </div>

              <!-- Individual Models -->
              <div 
                v-for="model in availableModels" 
                :key="model.id"
                class="model-select-card"
                :class="{ selected: selectedModel === model.id }"
                @click="setModel(model.id)"
              >
                <div class="radio-indicator">
                  <span v-if="selectedModel === model.id" class="radio-check">●</span>
                </div>
                <div class="model-select-info">
                  <div class="model-select-top">
                    <strong>{{ model.icon }} {{ model.name }}</strong>
                    <span class="badge badge-primary">{{ model.provider }}</span>
                  </div>
                  <p>{{ model.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: MODEL USAGE STATISTICS -->
    <div v-if="currentTab === 'stats'" class="tab-content-container">
      <div class="admin-card glass-panel">
        <div class="card-header flex-between">
          <div class="card-header-left">
            <span class="card-icon">📊</span>
            <div>
              <h3>Statistik Penggunaan Model AI</h3>
              <p class="card-subtitle">Pantau frekuensi generasi foto per model dan algoritma load balancing.</p>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" @click="resetModelStats">
            🔄 Reset Statistik Model
          </button>
        </div>

        <div class="card-body">
          <div class="stats-metric-grid">
            <div class="metric-card">
              <span class="metric-num">{{ modelStats.totalGenerations || 0 }}</span>
              <span class="metric-label">Total Generasi Foto AI</span>
            </div>
            <div class="metric-card metric-emerald">
              <span class="metric-num">{{ modelStats.leastUsedModelName || '-' }}</span>
              <span class="metric-label">Model Terpilih Load Balancer</span>
            </div>
          </div>

          <div class="models-table-container mt-4">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Model AI</th>
                  <th>Provider</th>
                  <th>Jumlah Dipakai</th>
                  <th>Persentase</th>
                  <th>Status Penyeimbang</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in modelStats.models" :key="m.id">
                  <td>
                    <strong>{{ m.icon }} {{ m.name }}</strong>
                  </td>
                  <td><span class="badge badge-primary">{{ m.provider }}</span></td>
                  <td><strong>{{ m.count || 0 }} kali</strong></td>
                  <td>
                    <div class="table-progress-wrap">
                      <div class="table-progress-bar">
                        <div class="table-progress-fill" :style="{ width: m.percentage }"></div>
                      </div>
                      <span>{{ m.percentage }}</span>
                    </div>
                  </td>
                  <td>
                    <span v-if="m.isLeastUsed" class="badge badge-emerald">⭐ Paling Jarang Dipakai</span>
                    <span v-else class="text-muted">Normal</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: BUKU TAMU PENGUNJUNG -->
    <div v-if="currentTab === 'guests'" class="tab-content-container">
      <div class="admin-card glass-panel">
        <div class="card-header flex-between">
          <div class="card-header-left">
            <span class="card-icon">👥</span>
            <div>
              <h3>Buku Tamu & Data Pengunjung Photobooth</h3>
              <p class="card-subtitle">Daftar kontak, usia, jenis kelamin, rating, dan peminatan prodi pengunjung.</p>
            </div>
          </div>
          <button class="btn btn-gold btn-sm" @click="exportGuestCsv" :disabled="guestsList.length === 0">
            📥 Ekspor CSV Buku Tamu
          </button>
        </div>

        <div class="card-body">
          <div class="stats-metric-grid">
            <div class="metric-card">
              <span class="metric-num">{{ guestStats.total || 0 }}</span>
              <span class="metric-label">Total Tamu Tercatat</span>
            </div>
            <div class="metric-card metric-gold">
              <span class="metric-num">★ {{ guestStats.avgRating || '5.0' }}</span>
              <span class="metric-label">Rata-rata Rating Kepuasan</span>
            </div>
            <div class="metric-card">
              <div class="prodi-dist-pills">
                <span class="prodi-pill prodi-inf">IT: {{ guestStats.prodiCounts?.informatika || 0 }}</span>
                <span class="prodi-pill prodi-mgt">MGT: {{ guestStats.prodiCounts?.manajemen || 0 }}</span>
                <span class="prodi-pill prodi-kep">KEP: {{ guestStats.prodiCounts?.keperawatan || 0 }}</span>
              </div>
              <span class="metric-label">Peminatan Program Studi</span>
            </div>
          </div>

          <!-- Search Toolbar -->
          <div class="guestbook-search-bar mt-4">
            <input 
              type="text" 
              v-model="guestSearch" 
              class="form-input" 
              placeholder="🔍 Cari nama, nomor HP, email, prodi..." 
            />
          </div>

          <!-- Visitors Table -->
          <div class="table-responsive mt-3">
            <div v-if="filteredGuests.length === 0" class="empty-state">
              Belum ada data tamu tercatat atau tidak cocok dengan pencarian.
            </div>
            <table v-else class="admin-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Nama Lengkap</th>
                  <th>Umur & Gender</th>
                  <th>Kontak (HP & Email)</th>
                  <th>Peminatan Prodi</th>
                  <th>Rating</th>
                  <th>Komentar & Saran</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="g in filteredGuests" :key="g.id">
                  <td class="text-sm text-muted">{{ formatTime(g.createdAt) }}</td>
                  <td><strong>{{ g.name }}</strong></td>
                  <td>{{ g.age ? g.age + ' th' : '-' }} • {{ g.gender || '-' }}</td>
                  <td>
                    <div class="contact-info">
                      <span>📱 {{ g.phone }}</span>
                      <span class="text-sm text-muted">✉️ {{ g.email }}</span>
                    </div>
                  </td>
                  <td><span class="badge badge-primary">{{ g.prodiName || g.prodiId }}</span></td>
                  <td>
                    <span class="star-rating-badge">★ {{ g.rating }}</span>
                  </td>
                  <td class="feedback-text">{{ g.feedback || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: HASIL KUESIONER RISET -->
    <div v-if="currentTab === 'questionnaires'" class="tab-content-container">
      <div class="admin-card glass-panel">
        <div class="card-header flex-between">
          <div class="card-header-left">
            <span class="card-icon">📋</span>
            <div>
              <h3>Hasil Analisis Kuesioner Riset</h3>
              <p class="card-subtitle">Evaluasi kemiripan wajah/pose, kesesuaian keyword, keseruan marketing, dan preferensi brosur.</p>
            </div>
          </div>
          <button class="btn btn-gold btn-sm" @click="exportQuestionnaireCsv" :disabled="questionnairesList.length === 0">
            📥 Ekspor CSV Kuesioner
          </button>
        </div>

        <div class="card-body">
          <!-- Research Scores Metric Cards -->
          <div class="scores-grid">
            <div class="score-card">
              <span class="score-num">{{ questionnaireStats.stats?.avgFace || '5.0' }} / 5.0</span>
              <span class="score-title">Q1. Kemiripan Wajah</span>
            </div>
            <div class="score-card">
              <span class="score-num">{{ questionnaireStats.stats?.avgPose || '5.0' }} / 5.0</span>
              <span class="score-title">Q2. Kemiripan Pose</span>
            </div>
            <div class="score-card">
              <span class="score-num">{{ questionnaireStats.stats?.avgKeyword || '5.0' }} / 5.0</span>
              <span class="score-title">Q3. Kesesuaian Keyword</span>
            </div>
            <div class="score-card">
              <span class="score-num">{{ questionnaireStats.stats?.avgMarketing || '5.0' }} / 5.0</span>
              <span class="score-title">Q4. Keseruan Marketing</span>
            </div>
            <div class="score-card score-highlight">
              <span class="score-num">{{ questionnaireStats.stats?.percentageKreatif || '100.0' }}%</span>
              <span class="score-title">Q5. Preferensi Brosur AI</span>
            </div>
          </div>

          <!-- Questionnaire Table -->
          <div class="table-responsive mt-4">
            <div v-if="questionnairesList.length === 0" class="empty-state">
              Belum ada respons kuesioner yang terekam.
            </div>
            <table v-else class="admin-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>ID Foto</th>
                  <th>Q1 Wajah</th>
                  <th>Q2 Pose</th>
                  <th>Q3 Keyword</th>
                  <th>Q4 Marketing</th>
                  <th>Q5 Preferensi Brosur</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="q in questionnairesList" :key="q.id">
                  <td class="text-sm text-muted">{{ formatTime(q.createdAt) }}</td>
                  <td class="text-sm"><code>{{ q.photoId || '-' }}</code></td>
                  <td>★ {{ q.q1_face }} / 5</td>
                  <td>★ {{ q.q2_pose }} / 5</td>
                  <td>★ {{ q.q3_keyword }} / 5</td>
                  <td>★ {{ q.q4_marketing }} / 5</td>
                  <td>
                    <span v-if="q.q5_brochure_preference === 'brosur_kreatif'" class="badge badge-emerald">
                      ✨ Brosur Kreatif AI Photobooth
                    </span>
                    <span v-else class="badge badge-secondary">
                      📄 Brosur Fisik Konvensional
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: PROMPT TEMPLATES & STYLES MANAGER -->
    <div v-if="currentTab === 'prompts'" class="tab-content-container">
      <div class="admin-card glass-panel">
        <div class="card-header prompt-manager-header">
          <div class="header-main-info">
            <span class="card-icon">🎨</span>
            <div>
              <h3>Manajemen Template Prompt & Gaya Visual</h3>
              <p class="card-subtitle">Tambah, ubah (edit), atau hapus template latar belakang, kostum, objek, dan gaya seni untuk AI Studio.</p>
            </div>
          </div>

          <div class="header-actions-group">
            <button class="btn btn-primary" @click="openAddPromptModal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>+ Tambah Template Baru</span>
            </button>
            <button class="btn btn-secondary btn-sm" @click="resetCurrentCategoryPrompts" title="Kembalikan kategori ini ke bawaan">
              🔄 Reset Kategori
            </button>
          </div>
        </div>

        <div class="card-body">
          <!-- Category Filter Pills -->
          <div class="prompt-category-pills">
            <button 
              class="cat-pill" 
              :class="{ active: activePromptCategory === 'latar' }"
              @click="activePromptCategory = 'latar'"
            >
              <span class="pill-icon">🌲</span>
              <span>Latar Belakang ({{ promptsData.latar?.length || 0 }})</span>
            </button>
            <button 
              class="cat-pill" 
              :class="{ active: activePromptCategory === 'kostum' }"
              @click="activePromptCategory = 'kostum'"
            >
              <span class="pill-icon">👔</span>
              <span>Kostum & Pakaian ({{ promptsData.kostum?.length || 0 }})</span>
            </button>
            <button 
              class="cat-pill" 
              :class="{ active: activePromptCategory === 'objek' }"
              @click="activePromptCategory = 'objek'"
            >
              <span class="pill-icon">👑</span>
              <span>Objek & Aksesoris ({{ promptsData.objek?.length || 0 }})</span>
            </button>
            <button 
              class="cat-pill" 
              :class="{ active: activePromptCategory === 'style' }"
              @click="activePromptCategory = 'style'"
            >
              <span class="pill-icon">🎨</span>
              <span>Gaya Seni Visual ({{ promptsData.style?.length || 0 }})</span>
            </button>
          </div>

          <!-- Search & Filter Row -->
          <div class="filter-search-row mt-3">
            <div class="search-input-wrap">
              <input 
                type="text" 
                v-model="promptSearchQuery" 
                class="form-input search-input" 
                :placeholder="'Cari nama atau prompt ' + getCategoryLabel(activePromptCategory) + '...'"
              />
              <span v-if="promptSearchQuery" class="clear-search-btn" @click="promptSearchQuery = ''">×</span>
            </div>
            <div class="item-count-badge">
              Menampilkan <strong>{{ filteredPromptsList.length }}</strong> item
            </div>
          </div>

          <!-- Prompts Grid -->
          <div v-if="filteredPromptsList.length > 0" class="admin-prompts-grid mt-4">
            <div 
              v-for="item in filteredPromptsList" 
              :key="item.id"
              class="admin-prompt-card"
              :class="{ 'custom-item': item.isCustom }"
            >
              <div class="card-top-row">
                <div class="icon-and-title">
                  <span class="prompt-card-icon">{{ item.icon || '✨' }}</span>
                  <div>
                    <h4 class="prompt-item-name">{{ item.name }}</h4>
                    <span class="badge badge-secondary badge-xs">{{ item.badge || 'Preset' }}</span>
                    <span v-if="item.isCustom" class="badge badge-emerald badge-xs ml-1">Kustom</span>
                  </div>
                </div>

                <div class="card-action-btns">
                  <button class="action-btn-sm edit-btn" @click="openEditPromptModal(item)" title="Edit Template">
                    ✏️
                  </button>
                  <button class="action-btn-sm delete-btn" @click="deletePromptItem(item)" title="Hapus Template">
                    🗑️
                  </button>
                </div>
              </div>

              <div class="prompt-text-preview">
                <p><code>{{ item.prompt }}</code></p>
              </div>
            </div>
          </div>

          <div v-else class="empty-state-card mt-4">
            <span class="empty-icon">🔍</span>
            <h4>Tidak ada template yang cocok</h4>
            <p>Tidak menemukan template dengan kata kunci "{{ promptSearchQuery }}".</p>
            <button class="btn btn-secondary btn-sm mt-2" @click="promptSearchQuery = ''">
              Reset Pencarian
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD / EDIT PROMPT TEMPLATE -->
    <div v-if="isPromptModalOpen" class="modal-overlay" @click="closePromptModal">
      <div class="modal-card prompt-editor-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-header-left">
            <span class="modal-icon">{{ editingPromptItem ? '✏️' : '✨' }}</span>
            <div>
              <h3>{{ editingPromptItem ? 'Edit Template Prompt' : 'Tambah Template Prompt Baru' }}</h3>
              <p class="modal-sub">Ikon otomatis mendeteksi kata kunci prompt atau nama yang Anda masukkan.</p>
            </div>
          </div>
          <button class="btn btn-secondary btn-icon btn-sm" @click="closePromptModal">×</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="savePromptForm">
            <!-- 1. Category & Badge Selection -->
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Kategori Template <span class="text-danger">*</span></label>
                <select v-model="promptForm.category" class="form-select" @change="onCategoryChanged">
                  <option value="latar">🌲 Latar Belakang (Background)</option>
                  <option value="kostum">👔 Kostum & Pakaian (Costume)</option>
                  <option value="objek">👑 Objek & Aksesoris (Object/Prop)</option>
                  <option value="style">🎨 Gaya Seni Visual (Art Style)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Label Badge</label>
                <input 
                  type="text" 
                  v-model="promptForm.badge" 
                  class="form-input" 
                  placeholder="Contoh: Magic, Trending, Formal, VIP" 
                />
              </div>
            </div>

            <!-- 2. Name and Auto-Icon Engine -->
            <div class="form-grid-icon-row mt-3">
              <div class="form-group flex-1">
                <label class="form-label">Nama Template / Judul Singkat <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  v-model="promptForm.name" 
                  class="form-input" 
                  placeholder="Contoh: Jas Dokter Medis, Kastil Salju, Mahkota Kristal" 
                  required
                  @input="onFormNameOrPromptChange"
                />
              </div>

              <div class="icon-picker-column">
                <label class="form-label">Icon / Emoji</label>
                <div class="icon-select-interactive">
                  <div class="current-icon-display" @click="showEmojiPicker = !showEmojiPicker" title="Klik untuk pilih emoji manual">
                    <span class="active-emoji">{{ promptForm.icon || '✨' }}</span>
                    <span class="icon-edit-pencil">✎</span>
                  </div>
                  <button type="button" class="btn btn-secondary btn-xs auto-icon-btn" @click="autoDetectIcon" title="Tebak Icon Otomatis dari Teks">
                    ✨ Auto
                  </button>
                </div>
              </div>
            </div>

            <!-- Emoji Quick Picker Grid (Toggled) -->
            <div v-if="showEmojiPicker" class="emoji-picker-dropdown glass-panel mt-2">
              <div class="emoji-picker-header">
                <span>Pilih Emoji / Icon:</span>
                <span class="close-picker" @click="showEmojiPicker = false">×</span>
              </div>
              <div class="emoji-palette-grid">
                <button 
                  v-for="em in popularEmojisList" 
                  :key="em" 
                  type="button" 
                  class="emoji-palette-btn"
                  :class="{ active: promptForm.icon === em }"
                  @click="selectEmoji(em)"
                >
                  {{ em }}
                </button>
              </div>
            </div>

            <!-- 3. Full Prompt Instruction -->
            <div class="form-group mt-3">
              <label class="form-label">Prompt AI / Instruksi Transformasi <span class="text-danger">*</span></label>
              <textarea 
                v-model="promptForm.prompt" 
                class="form-textarea" 
                rows="4" 
                placeholder="Deskripsikan detail visual untuk AI (misal: 'jas dokter putih elegan dengan stetoskop perak menggantung di leher dan kartu nama rumah sakit')." 
                required
                @input="onFormNameOrPromptChange"
              ></textarea>
              <span class="input-hint">
                💡 <em>Tips:</em> Jelaskan pencahayaan, material, warna, dan nuansa visual secara mendalam.
              </span>
            </div>

            <!-- 4. Live Preview Chip -->
            <div class="live-preview-box mt-3">
              <span class="preview-label">Live Preview di AI Studio:</span>
              <div class="preview-preset-chip">
                <div class="chip-top">
                  <span class="chip-icon">{{ promptForm.icon || '✨' }}</span>
                  <span class="badge badge-emerald">{{ promptForm.badge || 'Preview' }}</span>
                </div>
                <span class="chip-name">{{ promptForm.name || 'Nama Template' }}</span>
              </div>
            </div>

            <div class="modal-actions-row mt-4">
              <button type="button" class="btn btn-secondary" @click="closePromptModal">
                Batal
              </button>
              <button type="submit" class="btn btn-primary pulse-glow">
                💾 {{ editingPromptItem ? 'Simpan Perubahan' : 'Tambahkan Template' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- TAB 5: DANGER ZONE / KOSONGKAN DATA -->
    <div v-if="currentTab === 'reset'" class="tab-content-container">
      <div class="admin-card glass-panel danger-card">
        <div class="card-header">
          <span class="card-icon">⚠️</span>
          <div>
            <h3 class="text-danger">Kosongkan Riwayat & Data Pengguna</h3>
            <p class="card-subtitle">Hapus seluruh data rekaman tamu, kuesioner, dan statistik untuk persiapan pameran/event baru.</p>
          </div>
        </div>

        <div class="card-body">
          <div class="danger-notice-box">
            <span class="danger-notice-icon">🛑</span>
            <div>
              <h4>Perhatian: Tindakan ini bersifat permanen!</h4>
              <p>Menekan tombol di bawah akan mengosongkan seluruh:</p>
              <ul>
                <li>Semua data <strong>Buku Tamu</strong> pengunjung (nama, HP, email, rating).</li>
                <li>Semua data <strong>Hasil Kuesioner Riset</strong> (skor Q1–Q5).</li>
                <li>Statistik <strong>Frekuensi Penggunaan Model AI</strong> (kembali ke 0).</li>
                <li>File foto sementara yang tersimpan di server.</li>
              </ul>
            </div>
          </div>

          <div class="danger-action-row mt-4">
            <button 
              class="btn btn-danger btn-lg" 
              :disabled="isResettingData"
              @click="handleResetAllData"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              <span>{{ isResettingData ? 'Sedang Mengosongkan Data...' : '🗑️ Kosongkan Seluruh Riwayat Pengguna' }}</span>
            </button>
          </div>

          <div v-if="resetFeedback" class="alert-box alert-success mt-3">
            {{ resetFeedback }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import replicateService from '../services/replicateService.js';
import { AVAILABLE_MODELS, getModelById, AUTO_MODEL_ID } from '../data/modelsData.js';
import { 
  initPromptTemplates, 
  getPromptTemplates, 
  addPromptTemplate, 
  updatePromptTemplate, 
  deletePromptTemplate, 
  resetCategoryToDefault, 
  suggestIcon, 
  POPULAR_EMOJIS 
} from '../services/promptManagerService.js';

const emit = defineEmits(['go-photobooth']);

// Navigation State
const currentTab = ref('token');

// Prompt Templates Management State
const activePromptCategory = ref('latar');
const promptSearchQuery = ref('');
const promptsData = ref(initPromptTemplates());
const isPromptModalOpen = ref(false);
const editingPromptItem = ref(null);
const showEmojiPicker = ref(false);
const popularEmojisList = POPULAR_EMOJIS;

const promptForm = ref({
  id: '',
  name: '',
  prompt: '',
  category: 'latar',
  badge: 'Custom',
  icon: '🌲',
  autoIconLocked: false
});

// Token & Model State
const tokenInput = ref(replicateService.getApiToken() || '');
const showToken = ref(false);
const hasValidToken = ref(replicateService.hasValidToken());
const selectedModel = ref(replicateService.getModel());
const isTestingToken = ref(false);
const tokenFeedback = ref('');
const tokenFeedbackType = ref('alert-info');

const availableModels = AVAILABLE_MODELS;

// Stats & Data State
const modelStats = ref({
  totalGenerations: 0,
  leastUsedModel: 'bytedance/seedream-5-lite',
  leastUsedModelName: 'ByteDance SeaDream 5 Lite',
  models: []
});

const guestStats = ref({
  total: 0,
  avgRating: '5.0',
  prodiCounts: { informatika: 0, manajemen: 0, keperawatan: 0 }
});
const guestsList = ref([]);
const guestSearch = ref('');

const questionnaireStats = ref({
  total: 0,
  stats: {
    avgFace: '5.0',
    avgPose: '5.0',
    avgKeyword: '5.0',
    avgMarketing: '5.0',
    percentageKreatif: '100.0'
  }
});
const questionnairesList = ref([]);

// Danger Zone State
const isResettingData = ref(false);
const resetFeedback = ref('');

// Computed Visitors Filter
const filteredGuests = computed(() => {
  if (!guestSearch.value) return guestsList.value;
  const q = guestSearch.value.toLowerCase();
  return guestsList.value.filter(g => 
    (g.name && g.name.toLowerCase().includes(q)) ||
    (g.phone && g.phone.toLowerCase().includes(q)) ||
    (g.email && g.email.toLowerCase().includes(q)) ||
    (g.prodiName && g.prodiName.toLowerCase().includes(q)) ||
    (g.feedback && g.feedback.toLowerCase().includes(q))
  );
});

// Format Time Helper
function formatTime(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
  } catch (e) {
    return isoStr;
  }
}

// Navigation
function goBackToPhotobooth() {
  emit('go-photobooth');
  window.history.pushState({}, '', '/');
}

// API Token Actions
function saveToken() {
  replicateService.setApiToken(tokenInput.value);
  hasValidToken.value = replicateService.hasValidToken();
  tokenFeedback.value = hasValidToken.value 
    ? '✅ Token API berhasil disimpan dan mode Live AI aktif!'
    : 'ℹ️ Token dikosongkan. Mode Simulator aktif.';
  tokenFeedbackType.value = hasValidToken.value ? 'alert-success' : 'alert-info';
}

function removeToken() {
  tokenInput.value = '';
  replicateService.setApiToken('');
  hasValidToken.value = false;
  tokenFeedback.value = 'ℹ️ Token API telah dihapus. Sistem berjalan di mode simulator.';
  tokenFeedbackType.value = 'alert-info';
}

async function testToken() {
  if (!tokenInput.value.trim()) return;
  isTestingToken.value = true;
  tokenFeedback.value = 'Sedang menghubungi Replicate API server...';
  tokenFeedbackType.value = 'alert-info';

  const result = await replicateService.testConnection(tokenInput.value.trim());
  isTestingToken.value = false;

  if (result.success) {
    saveToken();
    tokenFeedback.value = `✅ Koneksi Replicate API Berhasil! (${result.user ? 'Akun: ' + result.user : 'Token Valid'})`;
    tokenFeedbackType.value = 'alert-success';
  } else {
    tokenFeedback.value = `❌ Gagal: ${result.error || 'Token tidak valid.'}`;
    tokenFeedbackType.value = 'alert-danger';
  }
}

function setModel(modelId) {
  selectedModel.value = modelId;
  replicateService.setModel(modelId);
}

// Fetchers
async function fetchModelStats() {
  try {
    const res = await axios.get('/api/models/stats');
    if (res.data?.success) {
      modelStats.value = res.data;
    }
  } catch (e) {
    console.error('Fetch model stats failed:', e);
  }
}

async function resetModelStats() {
  if (!confirm('Reset statistik frekuensi penggunaan model ke 0?')) return;
  try {
    await axios.post('/api/models/reset-stats');
    await fetchModelStats();
  } catch (e) {
    console.error('Reset model stats failed:', e);
  }
}

async function fetchGuests() {
  try {
    const res = await axios.get('/api/guests');
    if (res.data?.success) {
      guestStats.value = {
        total: res.data.total,
        avgRating: res.data.avgRating,
        prodiCounts: res.data.prodiCounts
      };
      guestsList.value = res.data.guests || [];
    }
  } catch (e) {
    console.error('Fetch guests failed:', e);
  }
}

function exportGuestCsv() {
  window.open('/api/guests/export', '_blank');
}

async function fetchQuestionnaires() {
  try {
    const res = await axios.get('/api/questionnaires');
    if (res.data?.success) {
      questionnaireStats.value = {
        total: res.data.total,
        stats: res.data.stats
      };
      questionnairesList.value = res.data.responses || [];
    }
  } catch (e) {
    console.error('Fetch questionnaires failed:', e);
  }
}

function exportQuestionnaireCsv() {
  window.open('/api/questionnaires/export', '_blank');
}

// Master Reset All User Data
async function handleResetAllData() {
  const confirmed = confirm(
    '⚠️ KONFIRMASI PENGOSONGAN DATA:\n\nApakah Anda YAKIN ingin MENGHAPUS SEMUA riwayat pengguna, buku tamu, kuesioner riset, dan foto tersimpan?\n\nTindakan ini bersifat permanen dan tidak dapat dibatalkan.'
  );
  if (!confirmed) return;

  isResettingData.value = true;
  resetFeedback.value = '';

  try {
    const res = await axios.post('/api/data/reset-all');
    if (res.data?.success) {
      resetFeedback.value = '🎉 Seluruh riwayat data pengguna, buku tamu, kuesioner riset, dan statistik model berhasil dikosongkan!';
      
      // Refresh all lists
      await fetchGuests();
      await fetchQuestionnaires();
      await fetchModelStats();
    }
  } catch (e) {
    alert('Gagal mengosongkan data: ' + (e.response?.data?.error || e.message));
  } finally {
    isResettingData.value = false;
  }
}

function getCategoryLabel(cat) {
  switch (cat) {
    case 'latar': return 'Latar Belakang';
    case 'kostum': return 'Kostum & Pakaian';
    case 'objek': return 'Objek & Aksesoris';
    case 'style': return 'Gaya Seni';
    default: return 'Template';
  }
}

const filteredPromptsList = computed(() => {
  const list = promptsData.value[activePromptCategory.value] || [];
  if (!promptSearchQuery.value.trim()) return list;

  const q = promptSearchQuery.value.toLowerCase().trim();
  return list.filter(item => {
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.prompt && item.prompt.toLowerCase().includes(q)) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  });
});

function openAddPromptModal() {
  editingPromptItem.value = null;
  showEmojiPicker.value = false;
  promptForm.value = {
    id: '',
    name: '',
    prompt: '',
    category: activePromptCategory.value,
    badge: 'Custom',
    icon: suggestIcon('', '', activePromptCategory.value),
    autoIconLocked: false
  };
  isPromptModalOpen.value = true;
}

function openEditPromptModal(item) {
  editingPromptItem.value = item;
  showEmojiPicker.value = false;
  promptForm.value = {
    id: item.id,
    name: item.name,
    prompt: item.prompt,
    category: item.category || activePromptCategory.value,
    badge: item.badge || '',
    icon: item.icon || suggestIcon(item.name, item.prompt, item.category),
    autoIconLocked: true
  };
  isPromptModalOpen.value = true;
}

function closePromptModal() {
  isPromptModalOpen.value = false;
  showEmojiPicker.value = false;
  editingPromptItem.value = null;
}

function onFormNameOrPromptChange() {
  if (!promptForm.value.autoIconLocked) {
    promptForm.value.icon = suggestIcon(
      promptForm.value.name, 
      promptForm.value.prompt, 
      promptForm.value.category
    );
  }
}

function autoDetectIcon() {
  promptForm.value.icon = suggestIcon(
    promptForm.value.name, 
    promptForm.value.prompt, 
    promptForm.value.category
  );
  promptForm.value.autoIconLocked = false;
}

function selectEmoji(emoji) {
  promptForm.value.icon = emoji;
  promptForm.value.autoIconLocked = true;
  showEmojiPicker.value = false;
}

function onCategoryChanged() {
  if (!promptForm.value.autoIconLocked) {
    promptForm.value.icon = suggestIcon(
      promptForm.value.name, 
      promptForm.value.prompt, 
      promptForm.value.category
    );
  }
}

function savePromptForm() {
  if (!promptForm.value.name.trim() || !promptForm.value.prompt.trim()) {
    alert('Mohon isi nama template dan instruksi prompt AI.');
    return;
  }

  if (editingPromptItem.value) {
    updatePromptTemplate(promptForm.value.category, promptForm.value.id, {
      name: promptForm.value.name,
      prompt: promptForm.value.prompt,
      badge: promptForm.value.badge,
      icon: promptForm.value.icon
    });
  } else {
    addPromptTemplate(promptForm.value.category, {
      name: promptForm.value.name,
      prompt: promptForm.value.prompt,
      badge: promptForm.value.badge,
      icon: promptForm.value.icon
    });
  }

  promptsData.value = { ...getPromptTemplates() };
  closePromptModal();
}

function deletePromptItem(item) {
  const confirmed = confirm(`Apakah Anda yakin ingin menghapus template "${item.name}"?`);
  if (!confirmed) return;

  deletePromptTemplate(item.category || activePromptCategory.value, item.id);
  promptsData.value = { ...getPromptTemplates() };
}

function resetCurrentCategoryPrompts() {
  const catName = getCategoryLabel(activePromptCategory.value);
  const confirmed = confirm(`Kembalikan seluruh template kategori "${catName}" ke daftar bawaan awal?`);
  if (!confirmed) return;

  resetCategoryToDefault(activePromptCategory.value);
  promptsData.value = { ...getPromptTemplates() };
}

onMounted(() => {
  fetchModelStats();
  fetchGuests();
  fetchQuestionnaires();
  promptsData.value = { ...initPromptTemplates() };
});
</script>

<style scoped>
.admin-setting-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px 80px;
  width: 100%;
}

/* Header Card */
.admin-header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 24px 30px;
  border-radius: var(--radius-lg);
  margin-bottom: 24px;
}

.header-badge {
  display: inline-flex;
  background: rgba(99, 102, 241, 0.15);
  color: var(--primary);
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.page-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.page-desc {
  font-size: 14px;
  color: var(--text-secondary);
  max-width: 700px;
}

/* Tabs Bar */
.admin-tabs-bar {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  overflow-x: auto;
}

.admin-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.admin-tab-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.admin-tab-btn.active {
  background: var(--primary);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.admin-tab-btn.tab-danger.active {
  background: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
}

/* Layout Grids */
.admin-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 900px) {
  .admin-header-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .admin-grid-2 {
    grid-template-columns: 1fr;
  }
}

/* Admin Cards */
.admin-card {
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
}

.card-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-color);
}

.card-header.flex-between {
  justify-content: space-between;
  align-items: center;
}

.card-header-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.card-icon {
  font-size: 26px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.card-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Status Box */
.status-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  margin-bottom: 16px;
}

.status-active {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.status-demo {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
}

.status-text {
  display: flex;
  flex-direction: column;
  font-size: 13px;
}

.status-text strong {
  font-size: 14px;
}

/* Input with Action */
.input-with-action {
  display: flex;
  gap: 8px;
}

.input-hint {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 6px;
}

.input-hint a {
  color: var(--primary);
  text-decoration: underline;
}

.action-buttons-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-danger-outline {
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-danger-outline:hover {
  background: #ef4444;
  color: #ffffff;
}

/* Model Select Cards */
.model-options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.model-select-card {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-panel);
  cursor: pointer;
  transition: all 0.2s ease;
}

.model-select-card:hover {
  border-color: var(--primary);
  background: var(--bg-hover);
}

.model-select-card.selected {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.08);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
}

.radio-indicator {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  flex-shrink: 0;
}

.model-select-card.selected .radio-indicator {
  border-color: var(--primary);
}

.radio-check {
  font-size: 14px;
  color: var(--primary);
  line-height: 1;
}

.model-select-info {
  flex: 1;
}

.model-select-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.model-select-top strong {
  font-size: 14px;
  color: var(--text-primary);
}

.model-select-info p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.least-used-preview {
  font-size: 11px;
  color: #10b981;
  margin-top: 4px;
}

/* Metric Grids */
.stats-metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-card {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  padding: 18px;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metric-num {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
}

.metric-emerald .metric-num {
  color: #10b981;
}

.metric-gold .metric-num {
  color: #f59e0b;
}

.prodi-dist-pills {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.prodi-pill {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 700;
}

.prodi-inf { background: rgba(99, 102, 241, 0.2); color: #818cf8; }
.prodi-mgt { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
.prodi-kep { background: rgba(16, 185, 129, 0.2); color: #34d399; }

/* Tables */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.admin-table th {
  background: var(--bg-panel);
  color: var(--text-secondary);
  font-weight: 700;
  padding: 12px 14px;
  text-align: left;
  border-bottom: 2px solid var(--border-color);
}

.admin-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}

.admin-table tr:hover td {
  background: var(--bg-hover);
}

.table-progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.table-progress-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-panel);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.table-progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: var(--radius-full);
}

.table-responsive {
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.star-rating-badge {
  color: #f59e0b;
  font-weight: 700;
}

.contact-info {
  display: flex;
  flex-direction: column;
}

.feedback-text {
  max-width: 250px;
  font-size: 12px;
  color: var(--text-secondary);
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

/* Research Scores Grid */
.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

.score-card {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  padding: 16px;
  border-radius: var(--radius-md);
  text-align: center;
}

.score-num {
  font-size: 22px;
  font-weight: 800;
  color: var(--primary);
  display: block;
  margin-bottom: 4px;
}

.score-title {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
}

.score-highlight {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.06);
}

.score-highlight .score-num {
  color: #10b981;
}

/* Danger Zone */
.danger-card {
  border-color: rgba(239, 68, 68, 0.3);
}

.text-danger {
  color: #ef4444;
}

.danger-notice-box {
  display: flex;
  gap: 16px;
  padding: 18px 20px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: var(--radius-md);
  color: var(--text-primary);
}

.danger-notice-icon {
  font-size: 28px;
}

.danger-notice-box h4 {
  color: #ef4444;
  font-size: 15px;
  margin-bottom: 6px;
}

.danger-notice-box p {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.danger-notice-box ul {
  padding-left: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ef4444;
  color: #ffffff;
  border: none;
  padding: 14px 24px;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Alert Boxes */
.alert-box {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
}

.alert-success {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.alert-info {
  background: rgba(99, 102, 241, 0.15);
  color: var(--primary);
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.alert-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
.ml-1 { margin-left: 4px; }

/* Prompt Templates Manager Styles */
.prompt-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-main-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-actions-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prompt-category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cat-pill:hover {
  background: rgba(99, 102, 241, 0.1);
  color: var(--text-primary);
  border-color: rgba(99, 102, 241, 0.3);
}

.cat-pill.active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.filter-search-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-input-wrap {
  position: relative;
  flex: 1;
  max-width: 420px;
}

.search-input {
  width: 100%;
  padding-right: 32px;
}

.clear-search-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 18px;
}

.item-count-badge {
  font-size: 13px;
  color: var(--text-secondary);
}

.admin-prompts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}

.admin-prompt-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.admin-prompt-card:hover {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(255, 255, 255, 0.05);
}

.admin-prompt-card.custom-item {
  border-left: 3px solid #10b981;
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.icon-and-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prompt-card-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.prompt-item-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.badge-xs {
  font-size: 10px;
  padding: 2px 6px;
}

.card-action-btns {
  display: flex;
  gap: 6px;
}

.action-btn-sm {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.15s ease;
}

.action-btn-sm:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.action-btn-sm.delete-btn:hover {
  background: #ef4444;
  border-color: #ef4444;
}

.prompt-text-preview {
  background: rgba(0, 0, 0, 0.25);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  max-height: 70px;
  overflow-y: auto;
}

.prompt-text-preview code {
  color: #cbd5e1;
  font-family: inherit;
}

.empty-state-card {
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-color);
}

.empty-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

/* Prompt Editor Modal */
.prompt-editor-modal {
  max-width: 600px;
  width: 100%;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-grid-icon-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.flex-1 { flex: 1; }

.icon-picker-column {
  width: 130px;
}

.icon-select-interactive {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-icon-display {
  width: 46px;
  height: 46px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
}

.current-icon-display:hover {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.15);
}

.active-emoji {
  font-size: 24px;
}

.icon-edit-pencil {
  position: absolute;
  right: 2px;
  bottom: 2px;
  font-size: 10px;
  color: var(--text-muted);
}

.auto-icon-btn {
  padding: 6px 8px;
  font-size: 11px;
  font-weight: 700;
}

.emoji-picker-dropdown {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  padding: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.emoji-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.close-picker {
  font-size: 16px;
  cursor: pointer;
}

.emoji-palette-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  max-height: 160px;
  overflow-y: auto;
}

.emoji-palette-btn {
  font-size: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 6px 2px;
  cursor: pointer;
  transition: transform 0.1s ease, background 0.1s ease;
}

.emoji-palette-btn:hover {
  background: rgba(99, 102, 241, 0.3);
  transform: scale(1.15);
}

.emoji-palette-btn.active {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.4);
}

.live-preview-box {
  background: rgba(0, 0, 0, 0.25);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
}

.preview-label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.preview-preset-chip {
  display: inline-flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(99, 102, 241, 0.4);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  min-width: 140px;
}

.chip-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.chip-icon {
  font-size: 18px;
}

.chip-name {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
}

.modal-actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
