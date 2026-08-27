import axios from 'axios';
import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

async function testConnectionHeaders() {
  console.log('--- Test 1: Axios with standard browser headers ---');
  try {
    const res = await axios.get('https://api.replicate.com/v1/models/bytedance/seedream-5-lite', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'close'
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 10000
    });
    console.log('Result 1 Success! Status:', res.status);
  } catch (err) {
    console.log('Result 1 Failed:', err.code, err.message);
  }

  console.log('--- Test 2: Axios with curl user agent ---');
  try {
    const res = await axios.get('https://api.replicate.com/v1/models/bytedance/seedream-5-lite', {
      headers: {
        'User-Agent': 'curl/7.88.1',
        'Accept': '*/*'
      },
      timeout: 10000
    });
    console.log('Result 2 Success! Status:', res.status);
  } catch (err) {
    console.log('Result 2 Failed:', err.code, err.message);
  }

  console.log('--- Test 3: Test Free Image Hosting Fallback (imgbb / tmpfiles) ---');
  try {
    const dummyBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    const formData = new FormData();
    const blob = new Blob([dummyBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');

    const res = await axios.post('https://tmpfiles.org/api/v1/upload', formData, { timeout: 10000 });
    console.log('tmpfiles upload success:', res.data?.data?.url);
    if (res.data?.data?.url) {
      // Direct url is https://tmpfiles.org/dl/...
      const directUrl = res.data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      console.log('Direct image URL for Replicate:', directUrl);
    }
  } catch (err) {
    console.log('tmpfiles upload failed:', err.message);
  }
}

testConnectionHeaders();
