import axios from 'axios';

async function testUploadProviders() {
  console.log('Testing upload providers for user photo hosting...');
  const dummyBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  
  // Provider 1: tmpfiles.org
  try {
    const formData = new FormData();
    const blob = new Blob([dummyBuffer], { type: 'image/png' });
    formData.append('file', blob, 'photobooth_user.png');

    const res = await axios.post('https://tmpfiles.org/api/v1/upload', formData, { timeout: 10000 });
    const rawUrl = res.data?.data?.url;
    const directUrl = rawUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
    console.log('✅ Provider tmpfiles.org Direct URL:', directUrl);
  } catch (e) {
    console.warn('❌ tmpfiles failed:', e.message);
  }

  // Provider 2: catbox.moe
  try {
    const formData = new FormData();
    const blob = new Blob([dummyBuffer], { type: 'image/png' });
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', blob, 'photobooth_user.png');

    const res = await axios.post('https://catbox.moe/user/api.php', formData, { timeout: 10000 });
    console.log('✅ Provider catbox.moe Direct URL:', res.data);
  } catch (e) {
    console.warn('❌ catbox failed:', e.message);
  }
}

testUploadProviders();
