<template>
  <header class="app-header no-print">
    <div class="header-container">
      <!-- Brand Logo -->
      <div class="brand-container" @click="isSettingPage ? $emit('go-photobooth') : $emit('go-step', 1)">
        <div class="logo-icon-box">
          <svg class="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3.5"/>
            <path d="m18.5 4 1 1.5 1.5-1" stroke="#fbbf24" stroke-width="2"/>
          </svg>
          <span class="live-dot"></span>
        </div>
        <div class="brand-text">
          <div class="brand-title">
            <span class="gradient-text">AI PHOTOBOOTH</span>
            <span class="badge badge-primary version-tag hide-mobile">VUE 3</span>
          </div>
          <p class="brand-subtitle hide-mobile">Smart AI Studio & Interactive Kiosk</p>
        </div>
      </div>

      <!-- Desktop Step Navigation Indicators -->
      <nav v-if="!isSettingPage" class="steps-nav hide-mobile">
        <div 
          class="step-item" 
          :class="{ active: currentStep === 1, completed: currentStep > 1 }"
          @click="currentStep > 1 ? $emit('go-step', 1) : null"
        >
          <div class="step-num">
            <span v-if="currentStep <= 1">1</span>
            <svg v-else class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="step-label">
            <span class="step-title">Ambil Foto</span>
            <span class="step-desc">Kamera / Galeri</span>
          </div>
        </div>

        <div class="step-connector" :class="{ filled: currentStep >= 2 }"></div>

        <div 
          class="step-item" 
          :class="{ active: currentStep === 2, completed: currentStep > 2, disabled: !hasImage }"
          @click="hasImage ? $emit('go-step', 2) : null"
        >
          <div class="step-num">
            <span v-if="currentStep <= 2">2</span>
            <svg v-else class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="step-label">
            <span class="step-title">AI Style Studio</span>
            <span class="step-desc">Latar & Kostum AI</span>
          </div>
        </div>

        <div class="step-connector" :class="{ filled: currentStep >= 3 }"></div>

        <div 
          class="step-item" 
          :class="{ active: currentStep === 3, disabled: !hasAiImage }"
          @click="hasAiImage ? $emit('go-step', 3) : null"
        >
          <div class="step-num">3</div>
          <div class="step-label">
            <span class="step-title">Unduh & Print</span>
            <span class="step-desc">QR & Form Tamu</span>
          </div>
        </div>
      </nav>

      <!-- If on Setting page, show Photobooth shortcut -->
      <div v-else class="setting-nav-indicator hide-mobile">
        <button class="btn btn-secondary btn-sm" @click="$emit('go-photobooth')">
          📸 ← Kembali ke Photobooth
        </button>
      </div>

      <!-- Right Header Actions -->
      <div class="header-actions">
        <!-- 🌓 LIGHT / DARK MODE TOGGLE -->
        <button 
          class="btn btn-secondary btn-sm theme-toggle-btn" 
          @click="toggleTheme" 
          :title="currentTheme === 'light' ? 'Ubah ke Mode Gelap' : 'Ubah ke Mode Terang'"
        >
          <span v-if="currentTheme === 'light'" class="theme-icon">🌙</span>
          <span v-else class="theme-icon">☀️</span>
          <span class="hide-mobile">{{ currentTheme === 'light' ? 'Dark' : 'Light' }}</span>
        </button>

        <!-- Admin Setting & Guestbook Button -->
        <button 
          class="btn btn-secondary btn-sm" 
          :class="{ 'btn-primary active': isSettingPage }"
          @click="isSettingPage ? $emit('go-photobooth') : $emit('open-settings')" 
          title="Pengaturan & Buku Tamu (/setting)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span class="hide-mobile">{{ isSettingPage ? 'Photobooth' : 'Setting & Data' }}</span>
        </button>

        <!-- Reset Button -->
        <button v-if="hasImage && !isSettingPage" class="btn btn-danger btn-sm" @click="$emit('reset-session')" title="Mulai Sesi Baru">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Mini Step Stepper Bar -->
    <div class="mobile-steps-bar show-mobile">
      <div 
        class="mobile-step-pill" 
        :class="{ active: currentStep === 1, completed: currentStep > 1 }"
        @click="currentStep > 1 ? $emit('go-step', 1) : null"
      >
        <span class="m-num">1</span>
        <span>Foto</span>
      </div>
      <div class="mobile-step-divider" :class="{ filled: currentStep >= 2 }"></div>
      <div 
        class="mobile-step-pill" 
        :class="{ active: currentStep === 2, completed: currentStep > 2, disabled: !hasImage }"
        @click="hasImage ? $emit('go-step', 2) : null"
      >
        <span class="m-num">2</span>
        <span>AI Studio</span>
      </div>
      <div class="mobile-step-divider" :class="{ filled: currentStep >= 3 }"></div>
      <div 
        class="mobile-step-pill" 
        :class="{ active: currentStep === 3, disabled: !hasAiImage }"
        @click="hasAiImage ? $emit('go-step', 3) : null"
      >
        <span class="m-num">3</span>
        <span>Unduh</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';

defineProps({
  currentStep: {
    type: Number,
    default: 1
  },
  hasImage: {
    type: Boolean,
    default: false
  },
  hasAiImage: {
    type: Boolean,
    default: false
  },
  isSettingPage: {
    type: Boolean,
    default: false
  }
});

defineEmits(['go-step', 'open-settings', 'open-guestbook', 'go-photobooth', 'reset-session']);

// Theme State (Light vs Dark)
const currentTheme = ref('light');

function initTheme() {
  const saved = localStorage.getItem('ai_photobooth_theme');
  if (saved === 'dark' || saved === 'light') {
    currentTheme.value = saved;
  } else {
    currentTheme.value = 'light';
  }
  applyTheme(currentTheme.value);
}

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('ai_photobooth_theme', currentTheme.value);
  applyTheme(currentTheme.value);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

onMounted(() => {
  initTheme();
});
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--nav-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: background 0.25s ease, border-color 0.25s ease;
}

.header-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 10px 16px;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

/* Brand */
.brand-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.logo-icon-box {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  border: 1.5px solid var(--border-accent);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
  transition: transform 0.2s;
}

.logo-svg {
  width: 22px;
  height: 22px;
  color: var(--accent-primary);
}

.live-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #10b981;
  border: 2px solid var(--bg-primary);
  border-radius: 50%;
  box-shadow: 0 0 6px #10b981;
  animation: pulseDot 2s infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.version-tag {
  font-size: 9px;
  padding: 1px 6px;
}

.brand-subtitle {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 500;
}

/* Steps Navigation */
.steps-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  transition: all 0.2s ease;
  cursor: pointer;
}

.step-item:not(.disabled):hover {
  background: var(--bg-card-hover);
  border-color: var(--border-medium);
}

.step-item.active {
  background: rgba(99, 102, 241, 0.12);
  border-color: var(--accent-primary);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
}

.step-item.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--border-medium);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  font-family: var(--font-main);
  transition: all 0.2s;
}

.step-item.active .step-num {
  background: var(--grad-primary);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.4);
}

.step-item.completed .step-num {
  background: var(--accent-emerald);
  color: #ffffff;
}

.check-icon {
  width: 13px;
  height: 13px;
}

.step-label {
  display: flex;
  flex-direction: column;
}

.step-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.step-desc {
  font-size: 9px;
  color: var(--text-muted);
}

.step-connector {
  width: 20px;
  height: 2px;
  background: var(--border-subtle);
  border-radius: 2px;
  transition: background 0.3s;
}

.step-connector.filled {
  background: var(--accent-primary);
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  padding: 6px 10px;
}

.theme-icon {
  font-size: 14px;
  line-height: 1;
}

/* Mobile Stepper Bar */
.show-mobile {
  display: none;
}

.mobile-steps-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 14px 8px;
  border-top: 1px solid var(--border-subtle);
  background: var(--nav-bg);
  gap: 4px;
}

.mobile-step-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 3px 8px;
  border-radius: 20px;
  transition: all 0.2s;
}

.mobile-step-pill.active {
  background: rgba(79, 70, 229, 0.15);
  color: var(--accent-primary);
}

.mobile-step-pill.completed {
  color: var(--accent-emerald);
}

.mobile-step-pill .m-num {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--border-medium);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: var(--text-primary);
}

.mobile-step-pill.active .m-num {
  background: var(--accent-primary);
  color: #ffffff;
}

.mobile-step-pill.completed .m-num {
  background: var(--accent-emerald);
  color: #ffffff;
}

.mobile-step-divider {
  flex: 1;
  height: 2px;
  background: var(--border-subtle);
}

.mobile-step-divider.filled {
  background: var(--accent-primary);
}

@media (max-width: 900px) {
  .steps-nav {
    display: none !important;
  }
  .hide-mobile {
    display: none !important;
  }
  .show-mobile {
    display: flex !important;
  }
}
</style>
