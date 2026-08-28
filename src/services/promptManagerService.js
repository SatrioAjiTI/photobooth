// ==========================================================================
// PROMPT TEMPLATE MANAGER SERVICE WITH AUTO-ICON SUGGESTION & PERSISTENCE
// ==========================================================================
import { 
  BACKGROUND_PRESETS, 
  COSTUME_PRESETS, 
  OBJECT_PRESETS, 
  ART_STYLES 
} from '../data/promptTemplates.js';
import axios from 'axios';

const STORAGE_KEY = 'photobooth_custom_prompts_v2';

// In-memory active stores
let activePrompts = {
  latar: [...BACKGROUND_PRESETS],
  kostum: [...COSTUME_PRESETS],
  objek: [...OBJECT_PRESETS],
  style: [...ART_STYLES]
};

// Curated Emojis for quick icon selection
export const POPULAR_EMOJIS = [
  '🌲', '🌌', '💎', '🔱', '🍄', '🏡', '🌧️', '🏯', '🏰', '☕', 
  '📚', '📖', '🏛️', '🌺', '🌅', '🏜️', '🪐', '🚀', '🏙️', '🌃',
  '🎨', '🖌️', '✨', '⚡', '🔥', '💧', '🌈', '🌙', '☀️', '❄️',
  '👔', '👗', '👘', '🧥', '🥻', '🧑‍🚀', '🧙', '🦸', '🤴', '👸',
  '👑', '👓', '🕶️', '🥽', '👒', '🎩', '🎓', '🪄', '🔮', '🎧',
  '📷', '📰', '⚔️', '🛡️', '🤖', '🐱', '🐶', '🐉', '🦋', '🌹'
];

// Smart Icon Suggester based on semantic analysis of keywords in Indonesian and English
export function suggestIcon(name = '', prompt = '', category = 'latar') {
  const text = `${name} ${prompt}`.toLowerCase();

  // 1. Specific Objects & Visual Elements
  if (text.match(/kacamata|glasses|sunglasses|visor|hud|cyber/i)) return '🕶️';
  if (text.match(/mahkota|crown|tiara|raja|ratu|queen|king/i)) return '👑';
  if (text.match(/topi wisuda|wisuda|graduation|toga|sarjana/i)) return '🎓';
  if (text.match(/topi|hat|cap|beanie/i)) return '🎩';
  if (text.match(/kristal|crystal|berlian|diamond|permata/i)) return '💎';
  if (text.match(/sihir|magic|tongkat sihir|wand|wizard|witch|penyihir/i)) return '🪄';
  if (text.match(/bola kristal|orb|crystal ball/i)) return '🔮';
  if (text.match(/pedang|sword|katana|blade/i)) return '⚔️';
  if (text.match(/tameng|shield|perisai/i)) return '🛡️';
  if (text.match(/robot|cyborg|mech|android/i)) return '🤖';
  if (text.match(/sayap|wings|angel|fairy|peri/i)) return '🪽';
  if (text.match(/headphone|headset|earphone|musik/i)) return '🎧';
  if (text.match(/kamera|camera|foto|lens/i)) return '📷';
  if (text.match(/koran|newspaper|berita|warta/i)) return '📰';
  if (text.match(/buku|book|library|perpustakaan/i)) return '📚';

  // 2. Costumes & Fashion
  if (text.match(/jas|tuxedo|suit|formal|blazer/i)) return '👔';
  if (text.match(/gaun|dress|gown|kebaya|party/i)) return '👗';
  if (text.match(/kimono|yukata|hanbok|jepang/i)) return '👘';
  if (text.match(/batik|tenun|nusantara|tradisional/i)) return '🥻';
  if (text.match(/jaket|jacket|coat|hoodie/i)) return '🧥';
  if (text.match(/astronot|astronaut|space suit/i)) return '🧑‍🚀';
  if (text.match(/dokter|doctor|medis|nurse|perawat/i)) return '🩺';
  if (text.match(/superhero|pahlawan|cape/i)) return '🦸';
  if (text.match(/disko|disco|70s|sparkle|glitter/i)) return '🕺';
  if (text.match(/baju besi|armor|knight|kesatria/i)) return '🛡️';

  // 3. Nature, Locations & Backgrounds
  if (text.match(/hutan|forest|jungle|tree|pohon/i)) return '🌲';
  if (text.match(/aurora|borealis|northern lights/i)) return '🌌';
  if (text.match(/jamur|mushroom|fungi/i)) return '🍄';
  if (text.match(/laut|ocean|sea|pantai|beach|beachside/i)) return '🏖️';
  if (text.match(/air|water|underwater|atlantis|danau/i)) return '🌊';
  if (text.match(/bunga|flower|sakura|rose|taman/i)) return '🌸';
  if (text.match(/kastil|castle|palace|istana/i)) return '🏰';
  if (text.match(/jepang|japan|tokyo|shinto/i)) return '🏯';
  if (text.match(/kafe|cafe|coffee|kopi/i)) return '☕';
  if (text.match(/desa|village|cottage|rumah/i)) return '🏡';
  if (text.match(/gua|cave|grotto/i)) return '💎';
  if (text.match(/gunung|mountain|alpen|fuji/i)) return '🏔️';
  if (text.match(/salju|snow|winter|kutub|ice/i)) return '❄️';
  if (text.match(/luar angkasa|space|galaxy|bintang|planet/i)) return '🪐';
  if (text.match(/sunset|senja|matahari terbit|sunrise/i)) return '🌅';
  if (text.match(/malam|night|moon|bulan/i)) return '🌙';
  if (text.match(/neon|cyberpunk|futuristik/i)) return '⚡';
  if (text.match(/api|fire|flame|lava/i)) return '🔥';
  if (text.match(/hujan|rain|storm|petir/i)) return '🌧️';

  // 4. Art Styles & Visual Aesthetics
  if (text.match(/anime|manga|studio ghibli|makoto shinkai/i)) return '🌸';
  if (text.match(/lukisan|oil painting|cat minyak|canvas/i)) return '🎨';
  if (text.match(/cat air|watercolor|aquarelle/i)) return '🖌️';
  if (text.match(/3d render|pixar|disney|claymation|blender/i)) return '🧸';
  if (text.match(/retro|vintage|film|polaroid|analog/i)) return '🎞️';
  if (text.match(/komik|comic|pop art|marvel/i)) return '💥';
  if (text.match(/cyberpunk|synthwave|vaporwave/i)) return '⚡';
  if (text.match(/steampunk|victorian|brass/i)) return '⚙️';
  if (text.match(/gothic|dark fantasy|spooky|horor/i)) return '🦇';
  if (text.match(/cinematic|hollywood|movie/i)) return '🎬';
  if (text.match(/sketsa|sketch|pencil|charcoal/i)) return '✍️';
  if (text.match(/glitch|hologram|holographic/i)) return '✨';

  // Category Default Fallbacks
  switch (category) {
    case 'latar': return '🌄';
    case 'kostum': return '👔';
    case 'objek': return '✨';
    case 'style': return '🎨';
    default: return '⚡';
  }
}

// Load templates from LocalStorage with defaults
export function initPromptTemplates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.latar)) activePrompts.latar = parsed.latar;
        if (Array.isArray(parsed.kostum)) activePrompts.kostum = parsed.kostum;
        if (Array.isArray(parsed.objek)) activePrompts.objek = parsed.objek;
        if (Array.isArray(parsed.style)) activePrompts.style = parsed.style;
      }
    }
  } catch (e) {
    console.warn('LocalStorage prompts error:', e);
  }

  // Also attempt async sync with backend
  fetchBackendPrompts().catch(() => {});

  return activePrompts;
}

// Save active prompts to LocalStorage & Backend
function persistPrompts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activePrompts));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }

  // Sync with backend API in background
  try {
    axios.post('/api/prompts/save-all', activePrompts, { timeout: 10000 }).catch(() => {});
  } catch (e) {}
}

async function fetchBackendPrompts() {
  try {
    const res = await axios.get('/api/prompts', { timeout: 5000 });
    if (res.data?.success && res.data?.prompts) {
      const p = res.data.prompts;
      if (Array.isArray(p.latar) && p.latar.length > 0) activePrompts.latar = p.latar;
      if (Array.isArray(p.kostum) && p.kostum.length > 0) activePrompts.kostum = p.kostum;
      if (Array.isArray(p.objek) && p.objek.length > 0) activePrompts.objek = p.objek;
      if (Array.isArray(p.style) && p.style.length > 0) activePrompts.style = p.style;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activePrompts));
      } catch (e) {}
    }
  } catch (e) {
    // Local / offline fallback
  }
}

// Getter methods
export function getPromptTemplates() {
  return activePrompts;
}

export function getTemplatesByCategory(category = 'latar') {
  return activePrompts[category] || [];
}

// CRUD Operations
export function addPromptTemplate(category, item) {
  if (!activePrompts[category]) {
    activePrompts[category] = [];
  }

  const id = item.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const icon = item.icon || suggestIcon(item.name, item.prompt, category);

  const newItem = {
    id,
    name: item.name.trim(),
    icon,
    category,
    prompt: item.prompt.trim(),
    badge: item.badge ? item.badge.trim() : 'Custom',
    isCustom: true,
    createdAt: new Date().toISOString()
  };

  activePrompts[category].unshift(newItem);
  persistPrompts();
  return newItem;
}

export function updatePromptTemplate(category, id, updatedData) {
  if (!activePrompts[category]) return null;

  const idx = activePrompts[category].findIndex(item => item.id === id);
  if (idx === -1) return null;

  const current = activePrompts[category][idx];
  const icon = updatedData.icon || current.icon || suggestIcon(updatedData.name, updatedData.prompt, category);

  const updatedItem = {
    ...current,
    name: updatedData.name ? updatedData.name.trim() : current.name,
    prompt: updatedData.prompt ? updatedData.prompt.trim() : current.prompt,
    icon,
    badge: updatedData.badge !== undefined ? updatedData.badge.trim() : current.badge,
    updatedAt: new Date().toISOString()
  };

  activePrompts[category][idx] = updatedItem;
  persistPrompts();
  return updatedItem;
}

export function deletePromptTemplate(category, id) {
  if (!activePrompts[category]) return false;

  const initialLen = activePrompts[category].length;
  activePrompts[category] = activePrompts[category].filter(item => item.id !== id);

  const deleted = activePrompts[category].length < initialLen;
  if (deleted) {
    persistPrompts();
  }
  return deleted;
}

export function resetCategoryToDefault(category) {
  switch (category) {
    case 'latar':
      activePrompts.latar = [...BACKGROUND_PRESETS];
      break;
    case 'kostum':
      activePrompts.kostum = [...COSTUME_PRESETS];
      break;
    case 'objek':
      activePrompts.objek = [...OBJECT_PRESETS];
      break;
    case 'style':
      activePrompts.style = [...ART_STYLES];
      break;
  }
  persistPrompts();
  return activePrompts[category];
}

export function resetAllPromptsToDefault() {
  activePrompts = {
    latar: [...BACKGROUND_PRESETS],
    kostum: [...COSTUME_PRESETS],
    objek: [...OBJECT_PRESETS],
    style: [...ART_STYLES]
  };
  persistPrompts();
  return activePrompts;
}

// Initialize on module load
initPromptTemplates();
