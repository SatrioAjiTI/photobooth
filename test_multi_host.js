import axios from 'axios';

async function hostImagePublicly(buffer, contentType = 'image/png', token = '') {
  // Provider 1: Replicate Files API
  if (token) {
    try {
      console.log('Trying Replicate Files API...');
      const formData = new FormData();
      const blob = new Blob([buffer], { type: contentType });
      formData.append('content', blob, 'photobooth_input.png');

      const res = await axios.post(
        'https://api.replicate.com/v1/files',
        formData,
        {
          headers: { 'Authorization': `Bearer ${token.trim()}` },
          timeout: 25000
        }
      );
      if (res.data?.urls?.get) {
        console.log('✅ Hosted via Replicate Files API:', res.data.urls.get);
        return res.data.urls.get;
      }
    } catch (e) {
      console.warn('⚠️ Replicate Files API attempt failed:', e.message);
    }
  }

  // Provider 2: tmpfiles.org CDN fallback
  try {
    console.log('Trying tmpfiles.org CDN fallback...');
    const formData = new FormData();
    const blob = new Blob([buffer], { type: contentType });
    formData.append('file', blob, 'photobooth_input.png');

    const res = await axios.post('https://tmpfiles.org/api/v1/upload', formData, { timeout: 20000 });
    const rawUrl = res.data?.data?.url;
    if (rawUrl) {
      const directUrl = rawUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      console.log('✅ Hosted via tmpfiles CDN fallback:', directUrl);
      return directUrl;
    }
  } catch (e) {
    console.warn('⚠️ tmpfiles attempt failed:', e.message);
  }

  return null;
}

async function run() {
  const dummyBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  const url = await hostImagePublicly(dummyBuffer, 'image/png');
  console.log('Final Hosted URL:', url);
}

run();
