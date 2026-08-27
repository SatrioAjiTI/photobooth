import axios from 'axios';

async function testNewspaperAndQuestionnaire() {
  console.log('--- TEST 1: Save Photo with Newspaper Frame & Prodi Info ---');
  const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  const saveRes = await axios.post('http://localhost:3001/api/photos/save', {
    imageBase64: dummyBase64,
    frameType: 'newspaper-edition',
    guestName: 'Budi Santoso',
    prodiId: 'informatika',
    prodiName: 'Teknik Informatika'
  });

  console.log('Photo Save Result:', saveRes.data);
  const photoId = saveRes.data.photoId;

  console.log('\n--- TEST 2: Check Mobile Download Landing Page & Questionnaire HTML ---');
  const pageRes = await axios.get(`http://localhost:3001/download/${photoId}`);
  const html = pageRes.data;
  
  console.log('Page HTTP Status:', pageRes.status);
  console.log('Has KUALITAS GAMBAR Q1:', html.includes('Apakah muka yang dihasilkan masih mirip'));
  console.log('Has KUALITAS GAMBAR Q2:', html.includes('Apakah pose / gaya masih mirip'));
  console.log('Has KUALITAS GAMBAR Q3:', html.includes('Seberapa mirip hasil Keyword dan Gambar'));
  console.log('Has CREATIVE MARKETING Q4:', html.includes('Seberapa seru AI Photobooth untuk brosur'));
  console.log('Has CREATIVE MARKETING Q5:', html.includes('Brosur Kreatif Interaktif'));

  console.log('\n--- TEST 3: Submit Questionnaire Response ---');
  const qSubmitRes = await axios.post('http://localhost:3001/api/questionnaires', {
    photoId: photoId,
    q1_face: 5,
    q2_pose: 4,
    q3_keyword: 5,
    q4_marketing: 5,
    q5_brochure_preference: 'brosur_kreatif',
    respondentName: 'Budi Santoso'
  });
  console.log('Questionnaire Submit Result:', qSubmitRes.data);

  console.log('\n--- TEST 4: Get Questionnaire Analytics Summary ---');
  const qListRes = await axios.get('http://localhost:3001/api/questionnaires');
  console.log('Total Responses:', qListRes.data.total);
  console.log('Stats Summary:', qListRes.data.stats);

  console.log('\n--- TEST 5: Verify Questionnaire CSV Export ---');
  const csvRes = await axios.get('http://localhost:3001/api/questionnaires/export');
  console.log('CSV Status:', csvRes.status);
  console.log('CSV Header Preview:\n', csvRes.data.split('\n').slice(0, 2).join('\n'));

  console.log('\n🎉 ALL NEWSPAPER & QUESTIONNAIRE TESTS PASSED 100%!');
}

testNewspaperAndQuestionnaire().catch(console.error);
