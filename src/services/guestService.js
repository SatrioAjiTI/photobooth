import axios from 'axios';

const LOCAL_GUESTS_KEY = 'ai_photobooth_local_guests';

export const guestService = {
  // Save guest feedback and contact details
  async submitGuest({ name, age, gender, phone, email, rating, feedback, prodiId, prodiName, photoId, photoUrl }) {
    const payload = {
      name: name.trim(),
      age: age ? Number(age) : null,
      gender: gender ? gender.trim() : 'Laki-laki',
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      rating: Number(rating),
      feedback: feedback ? feedback.trim() : '',
      prodiId: prodiId || 'informatika',
      prodiName: prodiName || 'Teknik Informatika',
      photoId: photoId || null,
      photoUrl: photoUrl || null,
      timestamp: new Date().toISOString()
    };

    // Always cache locally
    const localGuests = this.getLocalGuests();
    localGuests.unshift(payload);
    localStorage.setItem(LOCAL_GUESTS_KEY, JSON.stringify(localGuests));

    // Try posting to backend API
    try {
      const response = await axios.post('/api/guests', payload);
      return response.data;
    } catch (error) {
      console.warn('Backend /api/guests offline, saved locally to browser storage.', error);
      return {
        success: true,
        message: 'Data tersimpan di penyimpanan lokal browser.',
        guest: payload
      };
    }
  },

  // Get local cache
  getLocalGuests() {
    try {
      const data = localStorage.getItem(LOCAL_GUESTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Fetch guest records from backend or fallback to local
  async getGuestList() {
    try {
      const res = await axios.get('/api/guests');
      return res.data;
    } catch (error) {
      const local = this.getLocalGuests();
      const total = local.length;
      const avg = total > 0
        ? (local.reduce((sum, g) => sum + (g.rating || 0), 0) / total).toFixed(1)
        : '5.0';

      const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      const prodiCounts = { informatika: 0, manajemen: 0, keperawatan: 0 };

      local.forEach(g => {
        if (g.rating && starCounts[g.rating] !== undefined) {
          starCounts[g.rating]++;
        }
        if (g.prodiId) {
          prodiCounts[g.prodiId] = (prodiCounts[g.prodiId] || 0) + 1;
        }
      });

      return {
        success: true,
        total,
        avgRating: avg,
        starCounts,
        prodiCounts,
        guests: local
      };
    }
  },

  // Fetch questionnaire research results
  async getQuestionnaires() {
    try {
      const res = await axios.get('/api/questionnaires');
      return res.data;
    } catch (error) {
      return {
        success: true,
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
      };
    }
  },

  // Export CSV
  exportCsv(guests) {
    let csv = 'ID,Waktu,Nama Lengkap,Umur,Jenis Kelamin,Nomor HP,Email,Peminatan Prodi,Rating Bintang,Komentar & Saran\n';
    guests.forEach((g, idx) => {
      const row = [
        `"${g.id || 'guest_' + idx}"`,
        `"${g.timestamp || g.createdAt || new Date().toISOString()}"`,
        `"${(g.name || '').replace(/"/g, '""')}"`,
        `"${g.age || ''}"`,
        `"${(g.gender || '').replace(/"/g, '""')}"`,
        `"${(g.phone || '').replace(/"/g, '""')}"`,
        `"${(g.email || '').replace(/"/g, '""')}"`,
        `"${(g.prodiName || g.prodiId || 'Teknik Informatika').replace(/"/g, '""')}"`,
        `"${g.rating}"`,
        `"${(g.feedback || '').replace(/"/g, '""')}"`
      ];
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ai-photobooth-guests-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
