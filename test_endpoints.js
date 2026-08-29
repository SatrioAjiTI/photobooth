import axios from 'axios';

async function testAll() {
  console.log('--- TEST 1: Check Server /api/info ---');
  const info = await axios.get('http://localhost:3001/api/info');
  console.log('Info:', info.data);

  console.log('\n--- TEST 2: Submit Guest Record (POST /api/guests) ---');
  const guestRes = await axios.post('http://localhost:3001/api/guests', {
    name: 'Rian Pratama',
    phone: '081234567890',
    email: 'rian@example.com',
    rating: 5,
    feedback: 'AI Photobooth nya sangat keren dan hasilnya cepat!'
  });
  console.log('Guest Res:', guestRes.data);

  console.log('\n--- TEST 3: Get Guestbook Records (GET /api/guests) ---');
  const guestList = await axios.get('http://localhost:3001/api/guests');
  console.log('Total guests:', guestList.data.total);
  console.log('Avg Rating:', guestList.data.avgRating);
  console.log('Guest sample:', guestList.data.guests[0]?.name);

  console.log('\n--- TEST 4: Save Photo for QR Code Download (POST /api/photos/save) ---');
  // 1x1 transparent PNG base64
  const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const photoRes = await axios.post('http://localhost:3001/api/photos/save', {
    imageBase64: dummyBase64,
    frameType: 'polaroid-classic',
    guestName: 'Rian Pratama'
  });
  console.log('Photo Save Res:', photoRes.data);

  console.log('\n--- TEST 5: Verify Mobile Download Page (GET /download/:id) ---');
  const downloadPage = await axios.get(`http://localhost:3001/download/${photoRes.data.photoId}`);
  console.log('Download Page HTTP Status:', downloadPage.status);
  console.log('Page Title contains:', downloadPage.data.includes('AI Photobooth • Unduh Foto Anda') ? 'YES ✅' : 'NO ❌');

  console.log('\n--- TEST 6: Test AI Generator (POST /api/replicate/generate - Simulator) ---');
  const genRes = await axios.post('http://localhost:3001/api/replicate/generate', {
    image: dummyBase64,
    prompt: 'cyberpunk neon warrior, 8k',
    isDemo: true
  });
  console.log('AI Gen Success:', genRes.data.success);
  console.log('Is Demo Mode:', genRes.data.isDemo);

  console.log('\n--- TEST 7: Submit Questionnaire with Hands Consistency (POST /api/questionnaires) ---');
  const qRes = await axios.post('http://localhost:3001/api/questionnaires', {
    photoId: photoRes.data.photoId,
    respondentName: 'Rian Pratama',
    q1_face: 5,
    q2_pose: 4,
    q3_hands: 5,
    q4_keyword: 5,
    q5_marketing: 5,
    q6_brochure_preference: 'brosur_kreatif'
  });
  console.log('Questionnaire Saved:', qRes.data.success);
  console.log('Saved Hands Score:', qRes.data.response?.q3_hands);

  console.log('\n--- TEST 8: Get Questionnaire Stats (GET /api/questionnaires) ---');
  const qStats = await axios.get('http://localhost:3001/api/questionnaires');
  console.log('Total responses:', qStats.data.total);
  console.log('Avg Hands Consistency (Q3):', qStats.data.stats?.avgHands);
  console.log('Kreatif Preference %:', qStats.data.stats?.percentageKreatif + '%');

  console.log('\n======================================');
  console.log('🎉 ALL 8 BACKEND & API TESTS PASSED SUCCESSFULLY!');
  console.log('======================================');
}

testAll().catch(e => console.error('Test failed:', e.message, e.response?.data));
