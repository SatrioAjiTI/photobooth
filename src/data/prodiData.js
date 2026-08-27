// Data Dummy 3 Program Studi untuk Konten Koran Berita Photobooth

export const PRODI_OPTIONS = [
  {
    id: 'informatika',
    name: 'Teknik Informatika',
    faculty: 'Fakultas Teknologi Informasi (FTI)',
    icon: '💻',
    color: '#0284c7',
    newspaperTitle: 'WARTA KAMPUS INFORMATIKA',
    editionTag: 'EDISI KHUSUS REVOLUSI AI & TEKNOLOGI',
    headline: 'MAHASISWA INFORMATIKA CIPTAKAN AI PHOTOBOOTH MASA DEPAN',
    subHeadline: 'Penerapan Deep Learning & Generative AI Menjawab Tantangan Industri 4.0',
    leadArticle: 'Program Studi Teknik Informatika berkomitmen melahirkan engineer unggul di bidang kecerdasan buatan, rekayasa perangkat lunak modern, dan keamanan siber. Kurikulum berbasis proyek nyata memastikan lulusan siap bersaing di kancah global.',
    quote: '"Teknologi bukan sekadar baris kode, melainkan karya nyata yang memberi solusi bagi masyarakat."',
    highlights: [
      '⭐ Akreditasi Unggul Internasional',
      '🤖 Laboratorium Riset AI & Robotika',
      '☁️ Sertifikasi Cloud & Cybersecurity',
      '💼 Prospek: AI Engineer, Fullstack Dev, Tech Lead'
    ],
    infoBox: {
      title: 'FOKUS PEMINATAN',
      items: ['Artificial Intelligence & Big Data', 'Full-Stack Software Engineering', 'Cybersecurity & Cloud Systems']
    },
    barcodeText: 'INF-2026-FTI-AI-EDITION'
  },
  {
    id: 'manajemen',
    name: 'Manajemen Bisnis',
    faculty: 'Fakultas Ekonomi & Bisnis (FEB)',
    icon: '📈',
    color: '#d97706',
    newspaperTitle: 'WARTA BISNIS & MANAJEMEN',
    editionTag: 'EDISI KHUSUS DIGITAL MARKETING & LEADERSHIP',
    headline: 'ERA BARU STRATEGI BISNIS DIGITAL & ENTREPRENEURSHIP',
    subHeadline: 'Mencetak Pemimpin Bisnis Kreatif & Wirausahawan Mandiri Berdaya Saing Global',
    leadArticle: 'Program Studi Manajemen membekali mahasiswa dengan keahlian strategic marketing, tata kelola keuangan modern, dan inkubasi startup digital. Didukung jejaring industri multinasional untuk program magang eksekutif.',
    quote: '"Inovasi bisnis yang hebat lahir dari kepekaan melihat peluang dan eksekusi strategi yang presisi."',
    highlights: [
      '⭐ Akreditasi Unggul',
      '🚀 Inkubator Startup & Bisnis Kreatif',
      '🌐 Program Magang Perusahaan Multinasional',
      '💼 Prospek: Business Analyst, Brand Manager, Founder'
    ],
    infoBox: {
      title: 'FOKUS PEMINATAN',
      items: ['Digital Marketing & E-Commerce', 'Financial & Investment Management', 'Strategic Entrepreneurship']
    },
    barcodeText: 'MGT-2026-FEB-BIZ-EDITION'
  },
  {
    id: 'keperawatan',
    name: 'Ilmu Keperawatan',
    faculty: 'Fakultas Ilmu Kesehatan (FIK)',
    icon: '🩺',
    color: '#059669',
    newspaperTitle: 'WARTA KESEHATAN & KEPERAWATAN',
    editionTag: 'EDISI KHUSUS PELAYANAN MEDIS HUMANIS',
    headline: 'TENAGA KESEHATAN PROFESIONAL BERSTANDAR INTERNASIONAL',
    subHeadline: 'Dedikasi Layanan Keperawatan Modern dengan Sentuhan Empati & Teknologi Medis',
    leadArticle: 'Program Studi Ilmu Keperawatan mendidik perawat profesional yang terampil, beretika tinggi, dan tanggap medis darurat. Dilengkapi fasilitas Rumah Sakit Mini berstandar internasional dan jaringan rumah sakit rujukan terkemuka.',
    quote: '"Merawat dengan hati nurani, melayani dengan kompetensi unggul dan integritas."',
    highlights: [
      '⭐ Akreditasi Unggul',
      '🏥 Laboratorium Rumah Sakit Mini Modern',
      '🎯 Tingkat Kelulusan Uji Kompetensi 100%',
      '💼 Prospek: Clinical Nurse Specialist, Health Director'
    ],
    infoBox: {
      title: 'FOKUS PEMINATAN',
      items: ['Keperawatan Gawat Darurat & Kritis', 'Keperawatan Medikal Bedah', 'Manajemen Pelayanan Rumah Sakit']
    },
    barcodeText: 'KEP-2026-FIK-MED-EDITION'
  }
];

export function getProdiById(id) {
  return PRODI_OPTIONS.find(p => p.id === id) || PRODI_OPTIONS[0];
}
