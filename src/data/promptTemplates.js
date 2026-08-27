// ==========================================================================
// PRESET PROMPT TEMPLATES FOR AI PHOTOBOOTH
// ==========================================================================

export const BACKGROUND_PRESETS = [
  // --- Alam Fantasi & Cahaya Ajaib ---
  {
    id: 'bioluminescence-forest',
    name: 'Hutan Bioluminesensi',
    icon: '🌲',
    category: 'latar',
    prompt: 'hutan ajaib bioluminesensi menyala dalam gelap di malam hari dengan tanaman dan jamur berpendar toska ungu mistis',
    badge: 'Magic'
  },
  {
    id: 'aurora-borealis',
    name: 'Pemandangan Aurora Borealis',
    icon: '🌌',
    category: 'latar',
    prompt: 'langit malam kutub utara yang disinari tirai cahaya aurora borealis hijau toska dan ungu spektakuler di atas pegunungan salju',
    badge: 'Spectacular'
  },
  {
    id: 'giant-crystal-cave',
    name: 'Gua Kristal Raksasa',
    icon: '💎',
    category: 'latar',
    prompt: 'gua bawah tanah megah dipenuhi formasi pilar kristal raksasa bercahaya zamrud dan kuarsa ungu yang memukau',
    badge: 'Fantasy'
  },
  {
    id: 'atlantis-underwater',
    name: 'Dasar Laut Atlantis',
    icon: '🔱',
    category: 'latar',
    prompt: 'kota bawah air atlantis kuno yang megah di dasar laut dengan pilar marmer, terumbu karang bercahaya, dan ikan tropis berenang',
    badge: 'Mythic'
  },
  {
    id: 'glowing-mushroom-forest',
    name: 'Hutan Jamur Raksasa Menyala',
    icon: '🍄',
    category: 'latar',
    prompt: 'hutan fantasi dipenuhi jamur kanopi raksasa yang menyala lembut di malam hari dengan spora berkilauan di udara',
    badge: 'Dreamy'
  },
  {
    id: 'fairy-tree-village',
    name: 'Desa Peri Pohon Raksasa',
    icon: '🏡',
    category: 'latar',
    prompt: 'desa rumah kayu peri mungil di dalam batang pohon purba raksasa dengan lentera kunang-kunang hangat',
    badge: 'Fairy'
  },

  // --- Perkotaan, Sejarah & Tempat Menarik ---
  {
    id: 'tokyo-rain-neon',
    name: 'Tokyo Hujan & Lampu Neon',
    icon: '🌧️',
    category: 'latar',
    prompt: 'jalanan tokyo shinjuku di malam hari saat hujan basah dengan pantulan lampu neon warna-warni di aspal basah berkilau',
    badge: 'Cyber'
  },
  {
    id: 'japan-castle-sunset',
    name: 'Kastil Jepang & Sakura',
    icon: '🏯',
    category: 'latar',
    prompt: 'kastil jepang tradisional kuno, pohon sakura bermekaran dengan kelopak bunga berjatuhan, dan pemandangan langit senja sunset oranye keemasan dramatis',
    badge: 'Trending'
  },
  {
    id: 'gothic-castle-ruins',
    name: 'Reruntuhan Kastil Gothic',
    icon: '🏰',
    category: 'latar',
    prompt: 'reruntuhan kastil megah bergaya arsitektur gothic di atas tebing berkabut di bawah sinar bulan purnama dramatis',
    badge: 'Gothic'
  },
  {
    id: 'paris-afternoon-cafe',
    name: 'Kafe Paris Sore Hari',
    icon: '☕',
    category: 'latar',
    prompt: 'kafe luar ruangan elegan di pinggir jalan paris saat sore hari dengan pemandangan jalan batu antik dan cahaya lampu hangat',
    badge: 'Romantic'
  },
  {
    id: 'ancient-magic-library',
    name: 'Perpustakaan Sihir Kuno',
    icon: '📚',
    category: 'latar',
    prompt: 'perpustakaan sihir kuno raksasa dengan rak buku melingkar tinggi tak berujung dan buku-buku berterbangan melayang',
    badge: 'Mystic'
  },
  {
    id: 'floating-sky-library',
    name: 'Perpustakaan Melayang',
    icon: '📖',
    category: 'latar',
    prompt: 'ruang perpustakaan dimensi langit dengan tangga melingkar dan rak-rak buku melayang di antara awan',
    badge: 'Surreal'
  },
  {
    id: 'castle-above-clouds',
    name: 'Kastil di Atas Awan',
    icon: '☁️',
    category: 'latar',
    prompt: 'istana megah berkilau emas putih yang berdiri kokoh terapung di atas lautan awan putih bersinar matahari',
    badge: 'Majestic'
  },
  {
    id: 'alice-labyrinth-garden',
    name: 'Labirin Alice in Wonderland',
    icon: '🌹',
    category: 'latar',
    prompt: 'taman labirin pagar tanaman mawar raksasa yang aneh dan megah dengan jam gantung melayang',
    badge: 'Wonderland'
  },

  // --- Luar Angkasa & Futuristik ---
  {
    id: 'space-station-earth',
    name: 'Stasiun Luar Angkasa & Bumi',
    icon: '🛰️',
    category: 'latar',
    prompt: 'jendela kubah observasi stasiun luar angkasa mengorbit dengan pemandangan bumi biru bulat megah dan gugusan galaksi',
    badge: 'Cosmic'
  },
  {
    id: 'hyperspace-tunnel',
    name: 'Terowongan Hyperspace',
    icon: '🚀',
    category: 'latar',
    prompt: 'lorong terowongan hyperspace kecepatan cahaya dengan garis-garis bintang warp biru terang melesat cepat',
    badge: 'Sci-Fi'
  },
  {
    id: 'mars-futuristic-base',
    name: 'Permukaan Planet Mars',
    icon: '🪐',
    category: 'latar',
    prompt: 'permukaan tanah merah planet mars dengan kubah pangkalan penelitian astronot futuristik di bawah langit kosmik',
    badge: 'Mars'
  },
  {
    id: 'cyberpunk-night-market',
    name: 'Pasar Malam Cyberpunk',
    icon: '🏮',
    category: 'latar',
    prompt: 'pasar malam jalanan cyberpunk sempit yang padat dengan lampion neon holografik, kios makanan futuristik, dan uap mengepul',
    badge: 'Popular'
  },
  {
    id: 'spaceship-cockpit-interior',
    name: 'Interior Pesawat Ruang Angkasa',
    icon: '🛸',
    category: 'latar',
    prompt: 'ruang kemudi anjungan pesawat luar angkasa canggih dengan layar navigasi holografik dan jendela kokpit luas',
    badge: 'Spaceship'
  },
  {
    id: 'scifi-plasma-lab',
    name: 'Laboratorium Fiksi Ilmiah',
    icon: '🔬',
    category: 'latar',
    prompt: 'laboratorium fiksi ilmiah masa depan canggih dengan tabung energi plasma, konsol holografik, dan cahaya biru steril',
    badge: 'Lab'
  },

  // --- Seni Konseptual, Surealis & Nuansa Sinematik ---
  {
    id: 'infinity-mirror-room',
    name: 'Ruang Cermin Tanpa Batas',
    icon: '🪞',
    category: 'latar',
    prompt: 'ruangan instalasi cermin tanpa batas dipenuhi ribuan titik lampu LED gantung bercahaya warna-warni',
    badge: 'Artistic'
  },
  {
    id: 'salvador-dali-dimension',
    name: 'Dimensi Jam Leleh Dali',
    icon: '🕰️',
    category: 'latar',
    prompt: 'lanskap surealisme artistik bergaya salvador dali dengan jam dinding meleleh di atas ranting pohon kering',
    badge: 'Surreal'
  },
  {
    id: 'holi-powder-explosion',
    name: 'Ledakan Bubuk Warna Holi',
    icon: '🎆',
    category: 'latar',
    prompt: 'ledakan debu bubuk warna-warni festival holi yang dinamis dan spektakuler memenuhi latar belakang',
    badge: 'Vibrant'
  },
  {
    id: 'spinning-mandala-pattern',
    name: 'Pola Mandala Berputar',
    icon: '🌀',
    category: 'latar',
    prompt: 'latar belakang pola seni mandala suci geometris simetris rumit yang bercahaya keemasan mistis',
    badge: 'Spiritual'
  },
  {
    id: 'cinematic-studio-lighting',
    name: 'Cinematic Studio Lighting',
    icon: '🎬',
    category: 'latar',
    prompt: 'latar belakang studio foto profesional dengan pencahayaan sinematik dramatis rim light tajam dan kontras elegan',
    badge: 'Pro'
  },
  {
    id: 'golden-hour-dramatic',
    name: 'Golden Hour Dramatis',
    icon: '🌅',
    category: 'latar',
    prompt: 'lanskap alam terbuka saat momen golden hour matahari terbenam keemasan yang hangat dan dramatis',
    badge: 'Golden'
  },
  {
    id: 'synthwave-vaporwave-grid',
    name: 'Synthwave & Vaporwave',
    icon: '🟪',
    category: 'latar',
    prompt: 'pemandangan grid digital neon bernuansa synthwave vaporwave warna ungu magenta dengan matahari retro terbenam bergaris',
    badge: 'Retro'
  },
  {
    id: 'misty-forest-mysterious',
    name: 'Hutan Berkabut & Misterius',
    icon: '🌫️',
    category: 'latar',
    prompt: 'hutan pinus berkabut tebal misterius di pagi hari dengan berkas cahaya matahari menembus kabut lembap',
    badge: 'Moody'
  },
  {
    id: 'sepia-vintage-studio',
    name: 'Sepia Vintage Klasik',
    icon: '📜',
    category: 'latar',
    prompt: 'suasana studio era victoria bernuansa sepia monokrom hangat klasik dengan tekstur antik',
    badge: 'Classic'
  }
];

export const COSTUME_PRESETS = [
  // --- Retro, Vintage & Pesta ---
  {
    id: '70s-disco-outfit',
    name: 'Pakaian Disko 70-an',
    icon: '🕺',
    category: 'kostum',
    prompt: 'kostum disko gemerlap tahun 1970-an dengan kerah lebar dan celana cutbray berkilau mengkilap',
    badge: 'Retro'
  },
  {
    id: '80s-neon-windbreaker',
    name: 'Jaket Windbreaker Neon 80s',
    icon: '🧥',
    category: 'kostum',
    prompt: 'jaket windbreaker retro color-block neon tahun 1980-an bergaya vintage vaporwave',
    badge: '80s Vibes'
  },
  {
    id: '1920s-mobster-suit',
    name: 'Jas Mafia Era 1920-an',
    icon: '🎩',
    category: 'kostum',
    prompt: 'setelan jas bergaris mafia era 1920-an (mobster pinstripe suit) dengan rompi dan dasi sutra',
    badge: 'Mobster'
  },
  {
    id: '1920s-flapper-dress',
    name: 'Gaun Flapper 1920s',
    icon: '👗',
    category: 'kostum',
    prompt: 'gaun pesta flapper era 1920-an dengan rumbai manik-manik dan hiasan kepala bulu anggun',
    badge: 'Vintage'
  },
  {
    id: 'royal-keraton-batik',
    name: 'Busana Adat Keraton / Batik Megah',
    icon: '👘',
    category: 'kostum',
    prompt: 'busana adat agung keraton nusantara bertabur benang emas prada, kain dodot batik tulis, dan selendang sutra megah',
    badge: 'Nusantara'
  },

  // --- Petualang, Post-Apocalyptic & Pejuang ---
  {
    id: 'alchemist-potions',
    name: 'Alkemis dengan Botol Ramuan',
    icon: '🧪',
    category: 'kostum',
    prompt: 'jubah kulit alkemis peneliti ramuan mistis lengkap dengan sabuk botol-botol ramuan bercahaya',
    badge: 'Fantasy'
  },
  {
    id: 'treasure-hunter-explorer',
    name: 'Pemburu Harta Karun',
    icon: '🤠',
    category: 'kostum',
    prompt: 'pakaian petualang pemburu harta karun gaya indiana jones dengan jaket kulit cokelat, kemeja safari, dan tas selempang',
    badge: 'Adventure'
  },
  {
    id: 'post-apocalyptic-survivor',
    name: 'Penyintas Post-Apocalyptic',
    icon: '🛡️',
    category: 'kostum',
    prompt: 'pakaian penyintas gurun pasir pasca-kiamat gaya mad max dengan pelindung bahu kulit lusuh dan aksen logam berkarat',
    badge: 'Mad Max'
  },
  {
    id: 'monster-hunter-coat',
    name: 'Pemburu Monster',
    icon: '🏹',
    category: 'kostum',
    prompt: 'mantel kulit panjang pemburu monster pemburu kegelapan dengan sabuk pedang perak dan botol ramuan penawar',
    badge: 'Action'
  },
  {
    id: 'viking-wolf-pelt',
    name: 'Viking Mantel Bulu Serigala',
    icon: '🪓',
    category: 'kostum',
    prompt: 'pakaian pejuang viking nordik kokoh dengan mantel bulu serigala tebal dan gelang kulit bertali',
    badge: 'Nordic'
  },
  {
    id: 'egyptian-pharaoh-royal',
    name: 'Ratu / Raja Mesir Kuno',
    icon: '👑',
    category: 'kostum',
    prompt: 'busana agung ratu / raja firaun mesir kuno dengan kerah emas berlapis batu lapis lazuli dan jubah putih anggun',
    badge: 'Pharaoh'
  },
  {
    id: 'aztec-eagle-warrior',
    name: 'Pejuang Suku Aztec',
    icon: '🦅',
    category: 'kostum',
    prompt: 'kostum pejuang elang suku aztec dengan hiasan kepala bulu quetzal megah dan jubah perisai tradisional',
    badge: 'Aztec'
  },
  {
    id: 'roman-gladiator-armor',
    name: 'Gladiator Romawi',
    icon: '⚔️',
    category: 'kostum',
    prompt: 'baju zirah gladiator colosseum romawi kuno dengan pelindung bahu logam lorica dan rok kulit bertabur paku kuningan',
    badge: 'Rome'
  },

  // --- Sci-Fi, Cyberpunk & Luar Angkasa ---
  {
    id: 'mecha-pilot-plugsuit',
    name: 'Pilot Mecha dengan Plugsuit',
    icon: '🤖',
    category: 'kostum',
    prompt: 'baju zirah plugsuit pilot robot mecha futuristik ketat berteknologi tinggi dengan konektor saraf siber',
    badge: 'Mecha'
  },
  {
    id: 'cyber-samurai-armor',
    name: 'Cyber-Samurai',
    icon: '🥷',
    category: 'kostum',
    prompt: 'baju zirah samurai berteknologi tinggi modern dengan ornamen lampu neon LED dan pelat baja karbon',
    badge: 'Popular'
  },
  {
    id: 'netrunner-jacket-cables',
    name: 'Netrunner Cyberpunk',
    icon: '⚡',
    category: 'kostum',
    prompt: 'jaket kulit netrunner jalanan cyberpunk berkerah tinggi dengan kabel serat optik dan port siber menyala',
    badge: 'Cyber'
  },
  {
    id: 'space-secret-agent',
    name: 'Agen Rahasia Antariksa',
    icon: '🕵️‍♂️',
    category: 'kostum',
    prompt: 'setelan jas agen rahasia kedirgantaraan luar angkasa dengan bahan serat optik pintar kedap hampa udara',
    badge: 'Cosmic'
  },
  {
    id: 'cyborg-mechanical-arm',
    name: 'Cyborg Lengan Mekanik',
    icon: '🦾',
    category: 'kostum',
    prompt: 'pakaian tempur cyborg taktis dengan lengan prostetik mekanik robotik titanium canggih',
    badge: 'Cyborg'
  },
  {
    id: 'time-traveler-steampunk',
    name: 'Penjelajah Waktu',
    icon: '⏳',
    category: 'kostum',
    prompt: 'busana penjelajah waktu perpaduan jubah era victoria klasik dengan alat navigasi waktu kuningan kronometer',
    badge: 'Time Travel'
  },

  // --- Mitologi, Fantasi & Klasik ---
  {
    id: 'knight-plate-armor',
    name: 'Ksatria Berbaju Besi',
    icon: '🛡️',
    category: 'kostum',
    prompt: 'baju zirah besi ksatria eropa abad pertengahan lengkap yang dipoles mengkilap dengan lambang kehormatan',
    badge: 'Knight'
  },
  {
    id: 'wizard-mage-robes',
    name: 'Penyihir (Wizard / Mage)',
    icon: '🧙',
    category: 'kostum',
    prompt: 'jubah penyihir agung bertudung beludru ungu berbintang dengan sulaman benang emas mistis',
    badge: 'Wizard'
  },
  {
    id: 'greek-deity-toga',
    name: 'Dewa / Dewi Yunani Kuno',
    icon: '🏛️',
    category: 'kostum',
    prompt: 'jubah chiton toga dewa/dewi mitologi yunani kuno sutra putih mengalir dengan mahkota daun laurel emas',
    badge: 'Mythology'
  },
  {
    id: 'forest-elf-attire',
    name: 'Peri Hutan Alami',
    icon: '🧝',
    category: 'kostum',
    prompt: 'pakaian peri hutan halus dari tenunan daun sutra, sulur tanaman merambat, dan bunga hutan bercahaya',
    badge: 'Elf'
  },
  {
    id: 'ninja-shinobi-tactical',
    name: 'Ninja Shinobi Hitam',
    icon: '🥷',
    category: 'kostum',
    prompt: 'pakaian shinobi ninja hitam legam taktis dengan masker penutup wajah dan sabuk shuriken',
    badge: 'Ninja'
  },
  {
    id: 'wild-west-cowboy',
    name: 'Koboi Wild West',
    icon: '🤠',
    category: 'kostum',
    prompt: 'pakaian koboi wild west klasik dengan rompi kulit, syal bandana merah, dan sabuk koboi',
    badge: 'Western'
  },
  {
    id: 'pirate-captain-coat',
    name: 'Kapten Bajak Laut',
    icon: '🏴‍☠️',
    category: 'kostum',
    prompt: 'mantel kapten bajak laut beludru merah berenda emas dengan kemeja ruff dan ikat pinggang pedang cutlass',
    badge: 'Pirate'
  },
  {
    id: 'victorian-detective',
    name: 'Detektif Era Victoria',
    icon: '🕵️',
    category: 'kostum',
    prompt: 'mantel trench coat detektif london era victoria klasik dengan syal wol dan topi fedora houndstooth',
    badge: 'Detective'
  }
];

export const OBJECT_PRESETS = [
  // --- Aksesori Kepala & Wajah ---
  {
    id: 'crystal-crown',
    name: 'Mahkota Kristal',
    icon: '👑',
    category: 'objek',
    prompt: 'mahkota kristal berkilau mewah bercahaya elegan di atas kepala',
    badge: 'Royal'
  },
  {
    id: 'steampunk-goggles',
    name: 'Kacamata Steampunk',
    icon: '🥽',
    category: 'objek',
    prompt: 'kacamata steampunk kuno beroda gigi perunggu kuningan bertengger di dahi',
    badge: 'Steampunk'
  },
  {
    id: 'retro-astronaut-helmet',
    name: 'Helm Astronot Retro',
    icon: '🧑‍🚀',
    category: 'objek',
    prompt: 'helm astronot kaca bulat retro dengan pantulan bintang kosmik',
    badge: 'Astronaut'
  },
  {
    id: 'cyberpunk-neon-visor',
    name: 'Cyberpunk Visor (Neon)',
    icon: '🕶️',
    category: 'objek',
    prompt: 'kacamata cyberpunk visor HUD neon holografik transparan bercahaya futuristik',
    badge: 'Cyber'
  },
  {
    id: 'kabuki-mask',
    name: 'Topeng Kabuki',
    icon: '🎭',
    category: 'objek',
    prompt: 'topeng kabuki jepang tradisional dengan corak merah putih artistik di samping kepala',
    badge: 'Japanese'
  },
  {
    id: 'magician-top-hat',
    name: 'Topi Pesulap',
    icon: '🎩',
    category: 'objek',
    prompt: 'topi pesulap tinggi klasik (magician top hat) hitam berkilau dengan pita sutra',
    badge: 'Magic'
  },
  {
    id: 'elf-ears',
    name: 'Telinga Peri (Elf Ears)',
    icon: '🧝',
    category: 'objek',
    prompt: 'telinga peri elf runcing anggun dengan anting permata alami bercahaya lembut',
    badge: 'Elf'
  },

  // --- Hewan Pendamping & Makhluk Ajaib ---
  {
    id: 'baby-dragon-shoulder',
    name: 'Naga Kecil di Bahu',
    icon: '🐉',
    category: 'objek',
    prompt: 'naga kecil imut bertengger di bahu dengan sisik berkilau dan mata bercahaya ceria',
    badge: 'Companion'
  },
  {
    id: 'flying-baby-dragon',
    name: 'Anak Naga Terbang',
    icon: '🐲',
    category: 'objek',
    prompt: 'anak naga kecil bersayap mini melayang ceria di udara di sebelah bahu',
    badge: 'Cute'
  },
  {
    id: 'snowy-owl',
    name: 'Burung Hantu Salju',
    icon: '🦉',
    category: 'objek',
    prompt: 'burung hantu salju putih megah bertengger anggun di dekat bahu',
    badge: 'Companion'
  },
  {
    id: 'cyber-cat-companion',
    name: 'Kucing Siber (Cyber-Cat)',
    icon: '🐱',
    category: 'objek',
    prompt: 'kucing siber robotik dengan mata bercahaya neon duduk di samping',
    badge: 'Cyber'
  },
  {
    id: 'kitsune-nine-tails',
    name: 'Rubah Ekor Sembilan (Kitsune)',
    icon: '🦊',
    category: 'objek',
    prompt: 'rubah putih berekor sembilan kitsune mistis dengan api roh biru melayang di sekitarnya',
    badge: 'Mythic'
  },
  {
    id: 'spirit-wolf',
    name: 'Serigala Roh (Spirit Wolf)',
    icon: '🐺',
    category: 'objek',
    prompt: 'serigala roh astral bercahaya putih kebiruan transparan berdiri kokoh di samping',
    badge: 'Spirit'
  },

  // --- Benda Sihir, Senjata & Gadget ---
  {
    id: 'flying-spellbook',
    name: 'Buku Mantra Terbang',
    icon: '📖',
    category: 'objek',
    prompt: 'buku mantra sihir kuno melayang bercahaya mistis dengan lembaran rune emas berpendar',
    badge: 'Magic'
  },
  {
    id: 'carved-magic-wand',
    name: 'Tongkat Sihir Kayu Berukir',
    icon: '🪄',
    category: 'objek',
    prompt: 'tongkat sihir kayu antik berukir dengan kristal sihir bercahaya di ujungnya yang digenggam',
    badge: 'Spells'
  },
  {
    id: 'glowing-lightsaber',
    name: 'Lightsaber Menyala',
    icon: '⚔️',
    category: 'objek',
    prompt: 'pedang energi lightsaber laser menyala terang bertenaga plasma biru/hijau',
    badge: 'Sci-Fi'
  },
  {
    id: 'futuristic-electric-guitar',
    name: 'Gitar Listrik Futuristik',
    icon: '🎸',
    category: 'objek',
    prompt: 'gitar listrik futuristik beraksen lampu neon dan bodi aerodinamis modern',
    badge: 'Music'
  },
  {
    id: 'led-transparent-umbrella',
    name: 'Payung LED Transparan',
    icon: '☂️',
    category: 'objek',
    prompt: 'payung transparan dengan lampu LED neon menyala di rusuknya',
    badge: 'Cyber'
  },
  {
    id: 'traditional-folding-fan',
    name: 'Kipas Lipat Tradisional',
    icon: '🪭',
    category: 'objek',
    prompt: 'kipas lipat sutra tradisional berlukiskan motif bunga megah',
    badge: 'Traditional'
  },
  {
    id: 'futuristic-drone',
    name: 'Drone Futuristik',
    icon: '🛸',
    category: 'objek',
    prompt: 'drone intai futuristik melayang dengan lampu indikator neon biru',
    badge: 'Drone'
  },
  {
    id: 'hologram-projector',
    name: 'Proyektor Hologram 3D',
    icon: '🌐',
    category: 'objek',
    prompt: 'proyektor hologram 3D melayang menampilkan antarmuka digital canggih',
    badge: 'Holo'
  },
  {
    id: 'mini-orbiting-planets',
    name: 'Planet-Planet Mini',
    icon: '🪐',
    category: 'objek',
    prompt: 'miniatur planet-planet mini dan tata surya bercahaya mengorbit melayang di sekitar',
    badge: 'Space'
  },

  // --- Aura, Partikel & Efek Visual ---
  {
    id: 'glowing-wings',
    name: 'Sayap Bercahaya',
    icon: '🪽',
    category: 'objek',
    prompt: 'sayap malaikat bercahaya suci keemasan megah membentang di punggung',
    badge: 'Divine'
  },
  {
    id: 'blue-fire-aura',
    name: 'Aura Api Biru',
    icon: '🔥',
    category: 'objek',
    prompt: 'aura kobaran api biru kosmik menyala mistis di sekeliling tubuh',
    badge: 'Aura'
  },
  {
    id: 'lightning-sparks',
    name: 'Percikan Petir Listrik',
    icon: '⚡',
    category: 'objek',
    prompt: 'percikan sambaran petir listrik biru neon dinamis berderak di sekitar',
    badge: 'Electric'
  },
  {
    id: 'falling-sakura-petals',
    name: 'Kelopak Sakura Berguguran',
    icon: '🌸',
    category: 'objek',
    prompt: 'kelopak bunga sakura merah muda lembut berguguran melayang di udara',
    badge: 'Romantic'
  },
  {
    id: 'neon-soap-bubbles',
    name: 'Gelembung Sabun Neon',
    icon: '🫧',
    category: 'objek',
    prompt: 'gelembung sabun neon berkilau warna-warni melayang di udara',
    badge: 'Dreamy'
  },
  {
    id: 'magic-glowing-fireflies',
    name: 'Kunang-Kunang Ajaib',
    icon: '✨',
    category: 'objek',
    prompt: 'kerumunan kunang-kunang ajaib bercahaya keemasan melayang berkilau di udara',
    badge: 'Glow'
  },
  {
    id: 'digital-glitch-effect',
    name: 'Glitch Digital Siber',
    icon: '💻',
    category: 'objek',
    prompt: 'efek distorsi glitch digital siber RGB futuristik',
    badge: 'Glitch'
  },
  {
    id: 'matrix-digital-rain',
    name: 'Efek Hujan Matriks (Matrix)',
    icon: '🟢',
    category: 'objek',
    prompt: 'hujan kode biner digital matriks warna hijau neon berjatuhan',
    badge: 'Matrix'
  },
  {
    id: 'cinematic-lens-flare',
    name: 'Lens Flare Sinematik',
    icon: '☀️',
    category: 'objek',
    prompt: 'pantulan cahaya lens flare optik sinematik anamorfik',
    badge: 'Cinematic'
  },
  {
    id: 'cosmic-stardust',
    name: 'Debu Bintang (Stardust)',
    icon: '🌠',
    category: 'objek',
    prompt: 'partikel debu bintang kosmik stardust berkilauan di udara',
    badge: 'Cosmic'
  },
  {
    id: 'vhs-glitch-tape',
    name: 'Kaset VHS Glitch',
    icon: '📼',
    category: 'objek',
    prompt: 'estetika rekaman kaset pita VHS retro vintage dengan garis scanline',
    badge: 'VHS'
  },
  {
    id: 'vintage-polaroid-border',
    name: 'Bingkai Polaroid Usang',
    icon: '🎞️',
    category: 'objek',
    prompt: 'efek tepi polaroid vintage usang klasik dengan tekstur butiran analog',
    badge: 'Analog'
  }
];

export const ART_STYLES = [
  // --- Populer & Default ---
  {
    id: 'photorealistic',
    name: 'Studio Photorealistic HD',
    icon: '📸',
    prompt: 'ultra realistic portrait photography, 8k resolution, Hasselblad medium format, sharp focus, masterpiece, studio lighting',
    badge: 'Default'
  },
  {
    id: 'pixar-3d',
    name: 'Animasi 3D Disney Pixar',
    icon: '🎬',
    prompt: 'cute 3D animated character style, Disney Pixar render, smooth porcelain clay skin, vibrant soft global illumination, octane 3D render',
    badge: 'Cute 3D'
  },
  {
    id: 'ghibli-anime',
    name: 'Studio Ghibli Anime',
    icon: '🎌',
    prompt: 'beloved Studio Ghibli anime style, Hayao Miyazaki aesthetic, lush watercolor scenery, soft warm pastel palette, whimsical look',
    badge: 'Anime'
  },
  {
    id: 'anime-retro-90s',
    name: 'Anime Retro 90s',
    icon: '📺',
    prompt: 'classic 1990s retro anime aesthetic, hand-painted cel animation look, soft vintage grain, nostalgic VHS color palette',
    badge: 'Retro'
  },
  {
    id: 'manga-japan',
    name: 'Manga Jepang (Shounen/Shoujo)',
    icon: '📖',
    prompt: 'authentic Japanese manga comic art style, detailed black ink screentone shading, expressive dramatic anime lineart',
    badge: 'Manga'
  },
  {
    id: 'manhwa-webtoon',
    name: 'Manhwa / Webtoon Korea',
    icon: '📱',
    prompt: 'vibrant Korean webtoon digital manhwa art style, crisp glossy coloring, soft lighting, modern digital painting',
    badge: 'Webtoon'
  },
  {
    id: 'american-superhero-comic',
    name: 'Komik Superhero Amerika',
    icon: '💥',
    prompt: 'modern American superhero comic book art style, bold dynamic ink lines, vivid dramatic Marvel/DC color grading, cel shading',
    badge: 'Comic'
  },
  {
    id: 'pop-art-warhol',
    name: 'Pop Art (Andy Warhol)',
    icon: '🖼️',
    prompt: 'iconic Andy Warhol screenprint pop art style, bold high-contrast saturated colors, halftone dot pattern, silk screen aesthetic',
    badge: 'Pop Art'
  },
  {
    id: 'rubber-hose-1930s',
    name: 'Kartun Klasik 1930s',
    icon: '📽️',
    prompt: '1930s vintage rubber hose animation style, black and white monochrome cartoon, retro Fleischer/Disney vintage film grain',
    badge: '1930s'
  },

  // --- Digital, Cyber & Game ---
  {
    id: 'pixel-art-retro',
    name: 'Pixel Art (Retro Game)',
    icon: '👾',
    prompt: 'retro 16-bit arcade pixel art style, crisp pixel grid, vibrant nostalgic video game sprite aesthetic',
    badge: 'Pixel'
  },
  {
    id: 'low-poly-3d',
    name: 'Low Poly 3D',
    icon: '🧊',
    prompt: 'stylized low-poly 3D geometric art style, faceted polygon surfaces, clean minimalist lighting, isometric perspective',
    badge: '3D'
  },
  {
    id: 'cyberpunk-digital-art',
    name: 'Cyberpunk Digital Art',
    icon: '⚡',
    prompt: 'futuristic cyberpunk digital illustration, glowing neon ultraviolet lighting, high-tech dark synthwave aesthetic, crisp digital details',
    badge: 'Cyber'
  },
  {
    id: 'vaporwave-synthwave',
    name: 'Vaporwave / Synthwave',
    icon: '🌴',
    prompt: 'retro 80s vaporwave synthwave aesthetics, pastel pink and purple gradients, neon gridlines, nostalgic retro-futurism',
    badge: 'Synthwave'
  },
  {
    id: 'minimalist-vector-art',
    name: 'Vektor Minimalis',
    icon: '📐',
    prompt: 'sleek flat minimalist vector art style, crisp clean geometric shapes, smooth solid color palettes, modern graphic design',
    badge: 'Vector'
  },

  // --- Lukisan Klasik & Media Seni Tradisional ---
  {
    id: 'oil-painting-impasto',
    name: 'Lukisan Cat Minyak (Impasto)',
    icon: '🎨',
    prompt: 'masterpiece classical oil painting, thick textured impasto palette knife brushstrokes, rich varnished canvas texture',
    badge: 'Oil Paint'
  },
  {
    id: 'watercolor-wash',
    name: 'Lukisan Cat Air (Watercolor)',
    icon: '💧',
    prompt: 'expressive fluid watercolor wash painting, soft pigment bleeding, natural rough paper texture, luminous translucent layers',
    badge: 'Watercolor'
  },
  {
    id: 'renaissance-classic',
    name: 'Renaissance Klasik',
    icon: '🏛️',
    prompt: 'classical Italian High Renaissance masterwork style, Leonardo da Vinci sfumato technique, dramatic Rembrandt chiaroscuro lighting',
    badge: 'Renaissance'
  },
  {
    id: 'impressionism-van-gogh',
    name: 'Impresionisme (Gaya Van Gogh)',
    icon: '🌻',
    prompt: 'post-impressionism painting style in the spirit of Vincent van Gogh, swirling energetic textured brushstrokes, vibrant passionate colors',
    badge: 'Van Gogh'
  },
  {
    id: 'ink-wash-sumie',
    name: 'Lukisan Tinta (Sumi-e)',
    icon: '🖌️',
    prompt: 'traditional East Asian ink wash painting style, sumi-e monochrome brushstrokes, watercolor bleeding on rice paper, zen aesthetic',
    badge: 'Sumi-e'
  },
  {
    id: 'ukiyo-e-woodblock',
    name: 'Ukiyo-e (Cetak Kayu Jepang)',
    icon: '🌊',
    prompt: 'traditional Japanese Ukiyo-e woodblock print art style, Hokusai aesthetic, delicate woodcut lineart, flat mineral pigments, washi texture',
    badge: 'Ukiyo-e'
  },
  {
    id: 'art-nouveau-mucha',
    name: 'Art Nouveau (Mucha)',
    icon: '⚜️',
    prompt: 'vintage Art Nouveau Alphonse Mucha decorative style, flowing organic botanical curves, ornate gold filigree frames, elegant pastel colors',
    badge: 'Nouveau'
  },
  {
    id: 'stained-glass-mosaic',
    name: 'Kaca Patri (Stained Glass)',
    icon: '🪟',
    prompt: 'gothic cathedral stained glass mosaic art style, luminous colorful glass tiles, bold black lead caming outlines, radiant sunlit glow',
    badge: 'Mosaic'
  },
  {
    id: 'magazine-paper-collage',
    name: 'Kliping Majalah / Kolase',
    icon: '✂️',
    prompt: 'eclectic mixed-media paper collage art, retro magazine cutouts, torn paper edges, tactile textured scrapbooking aesthetic',
    badge: 'Collage'
  },

  // --- Fotografi Artistik & Sinematik ---
  {
    id: 'noir-photography',
    name: 'Fotografi Noir (Hitam-Putih)',
    icon: '🕵️',
    prompt: 'dramatic vintage Film Noir black and white photography, harsh chiaroscuro shadows, Venetian blind light streaks, deep rich contrast',
    badge: 'Noir'
  },
  {
    id: 'vintage-polaroid',
    name: 'Polaroid Vintage',
    icon: '📷',
    prompt: 'authentic faded vintage Polaroid instant camera photo, warm analog color shift, soft focus, creamy nostalgic tones',
    badge: 'Vintage'
  },
  {
    id: 'cinematic-film-35mm',
    name: 'Cinematic Film 35mm',
    icon: '🎞️',
    prompt: 'cinematic 35mm film still, Kodak Portra color science, subtle organic film grain, shallow depth of field, blockbuster movie lighting',
    badge: '35mm'
  },
  {
    id: 'infrared-photography',
    name: 'Foto Inframerah (Infrared)',
    icon: '🌸',
    prompt: 'surreal color infrared aerochrome photography, vibrant pink and crimson foliage, glowing dreamlike ethereal white highlights',
    badge: 'Infrared'
  }
];

export const PHOTOBOOTH_FRAMES = [
  {
    id: 'polaroid-classic',
    name: 'Classic Polaroid',
    previewColor: '#ffffff',
    textColor: '#1e293b',
    description: 'Format polaroid ikonik dengan bingkai putih elegan dan teks kustom di bagian bawah.',
    badge: 'Favorit',
    slots: 1
  },
  {
    id: 'photobooth-strip-4',
    name: '4-Cut Photobooth Strip',
    previewColor: '#18181b',
    textColor: '#f4f4f5',
    description: 'Strip photobooth vertikal 4 foto klasik ala studio foto Korea (Life4Cuts style).',
    badge: 'Trendy 4-Cut',
    slots: 4
  },
  {
    id: 'cyber-neon',
    name: 'Cyberpunk Neon Border',
    previewColor: '#090d16',
    textColor: '#38bdf8',
    borderColor: '#06b6d4',
    description: 'Bingkai futuristik dengan aksen garis neon cyan & purple yang menyala.',
    badge: 'Futuristic',
    slots: 1
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Royal Gold',
    previewColor: '#1c1917',
    textColor: '#fbbf24',
    borderColor: '#f59e0b',
    description: 'Bingkai eksklusif warna hitam emas mewah cocok untuk acara formal, gala, dan pernikahan.',
    badge: 'VIP Event',
    slots: 1
  },
  {
    id: 'pastel-minimal',
    name: 'Pastel Lavender Minimalist',
    previewColor: '#faf5ff',
    textColor: '#6b21a8',
    borderColor: '#d8b4fe',
    description: 'Nuansa cerah pastel lembut estetik dengan border rounded kontemporer.',
    badge: 'Aesthetic',
    slots: 1
  }
];
