import dotenv from 'dotenv';
dotenv.config();

const token = process.env.REPLICATE_API_TOKEN;

async function testFetch() {
  console.log('Testing Node 24 native fetch to Replicate...');
  
  // 1. Test GET /v1/models/bytedance/seedream-5-lite
  try {
    const res = await fetch('https://api.replicate.com/v1/models/bytedance/seedream-5-lite', {
      headers: {
        'Authorization': `Bearer ${token || 'test'}`
      }
    });
    console.log('Native fetch status:', res.status);
    const data = await res.json();
    console.log('Model Name:', data.name || data.detail);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testFetch();
