import axios from 'axios';
import fs from 'fs';

// Let's test the upload to Replicate Files API using FormData
async function testUpload() {
  console.log('Testing Replicate Files Upload with FormData...');
  const dummyBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  
  const formData = new FormData();
  const blob = new Blob([dummyBuffer], { type: 'image/png' });
  formData.append('content', blob, 'test.png');

  // Check if token exists in guests or environment
  console.log('FormData ready: content appended.');
}

testUpload();
