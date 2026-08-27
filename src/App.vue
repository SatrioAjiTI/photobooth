<template>
  <div class="photobooth-app">
    <!-- Top Navigation Bar -->
    <Navbar 
      :currentStep="currentStep"
      :hasImage="!!originalImage"
      :hasAiImage="!!aiGeneratedImage"
      @go-step="goToStep"
      @open-settings="isSettingsOpen = true"
      @open-guestbook="isGuestbookOpen = true"
      @reset-session="handleResetSession"
    />

    <!-- Main Content Stage with Step Transitions -->
    <main class="app-main-content">
      <transition name="step-fade" mode="out-in">
        <!-- STEP 1: CAPTURE / UPLOAD -->
        <Step1Capture 
          v-if="currentStep === 1"
          :initialImage="originalImage"
          @photo-captured="onPhotoCaptured"
          @go-next="goToStep(2)"
        />

        <!-- STEP 2: AI STYLE STUDIO -->
        <Step2AIStudio 
          v-else-if="currentStep === 2"
          :originalImage="originalImage"
          :initialAiImage="aiGeneratedImage"
          @ai-completed="onAiCompleted"
          @open-settings="isSettingsOpen = true"
          @go-next="goToStep(3)"
        />

        <!-- STEP 3: DOWNLOAD, SCAN QR & PRINT -->
        <Step3Download 
          v-else-if="currentStep === 3"
          :aiImage="aiGeneratedImage || originalImage"
          @reset-session="handleResetSession"
        />
      </transition>
    </main>

    <!-- Modals -->
    <SettingsModal 
      v-if="isSettingsOpen" 
      @close="isSettingsOpen = false" 
    />

    <GuestbookModal 
      v-if="isGuestbookOpen" 
      @close="isGuestbookOpen = false" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from './components/Navbar.vue';
import Step1Capture from './components/Step1Capture.vue';
import Step2AIStudio from './components/Step2AIStudio.vue';
import Step3Download from './components/Step3Download.vue';
import SettingsModal from './components/SettingsModal.vue';
import GuestbookModal from './components/GuestbookModal.vue';

// App State
const currentStep = ref(1);
const originalImage = ref(null);
const aiGeneratedImage = ref(null);
const isSettingsOpen = ref(false);
const isGuestbookOpen = ref(false);

// Step Navigation
function goToStep(step) {
  if (step === 2 && !originalImage.value) return;
  if (step === 3 && !originalImage.value) return;
  currentStep.value = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Step 1 Callback
function onPhotoCaptured(imageSrc) {
  originalImage.value = imageSrc;
  aiGeneratedImage.value = null; // reset subsequent AI image if retaken
}

// Step 2 Callback
function onAiCompleted({ resultUrl }) {
  aiGeneratedImage.value = resultUrl;
}

// Reset Session
function handleResetSession() {
  if (confirm('Apakah Anda ingin memulai sesi baru untuk tamu berikutnya?')) {
    originalImage.value = null;
    aiGeneratedImage.value = null;
    currentStep.value = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Check backend status on load
onMounted(async () => {
  try {
    const res = await axios.get('/api/info');
    if (res.data?.hasServerToken) {
      window.__SERVER_HAS_TOKEN = true;
    }
  } catch (e) {
    console.log('Running in local standalone mode.');
  }
});
</script>

<style scoped>
.photobooth-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main-content {
  flex: 1;
  width: 100%;
}

/* Step Transitions */
.step-fade-enter-active,
.step-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.step-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.step-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
