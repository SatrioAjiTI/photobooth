// High-Resolution Newspaper Photobooth Canvas Frame Renderer
import { getProdiById } from '../data/prodiData.js';

export async function renderPhotoboothFrame({
  imageSrc,
  prodiId = 'informatika',
  guestName = '',
  eventTitle = 'WARTA KAMPUS',
  dateText = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}) {
  const prodi = getProdiById(prodiId);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        renderNewspaperFrame(canvas, ctx, img, prodi, guestName, dateText);

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch (err) {
        console.error('Canvas render error:', err);
        reject(err);
      }
    };

    img.onerror = (e) => reject(new Error('Gagal memuat gambar untuk render bingkai koran.'));
    img.src = imageSrc;
  });
}

// Newspaper Frame Renderer (2000 x 2800 px)
function renderNewspaperFrame(canvas, ctx, img, prodi, guestName, date) {
  canvas.width = 2000;
  canvas.height = 2800;

  // 1. Vintage Newsprint Background
  ctx.fillStyle = '#f8f6f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer Margins & Borders
  const m = 60;
  ctx.strokeStyle = '#1e1b18';
  ctx.lineWidth = 3;
  ctx.strokeRect(m, m, canvas.width - (m * 2), canvas.height - (m * 2));
  
  // Thin Inner Border
  ctx.strokeStyle = '#2d2822';
  ctx.lineWidth = 1;
  ctx.strokeRect(m + 8, m + 8, canvas.width - (m * 2) - 16, canvas.height - (m * 2) - 16);

  // 2. Top Header Metadata Line
  ctx.fillStyle = '#4a443c';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`★ EDISI KHUSUS: ${prodi.editionTag} ★`, m + 30, m + 40);

  ctx.textAlign = 'right';
  ctx.fillText('THE OFFICIAL CAMPUS DAILY GAZETTE • HARGA: GRATIS', canvas.width - m - 30, m + 40);

  // Double Divider Line
  drawDoubleLine(ctx, m + 20, m + 55, canvas.width - m - 20, 3, 1, 4);

  // 3. Masthead (Newspaper Main Title)
  ctx.fillStyle = '#110e0c';
  ctx.font = '900 88px "Playfair Display", "Times New Roman", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(prodi.newspaperTitle.toUpperCase(), canvas.width / 2, m + 145);

  // Sub-masthead details bar (Date, Vol, Faculty)
  drawDoubleLine(ctx, m + 20, m + 175, canvas.width - m - 20, 1, 1, 3);

  ctx.fillStyle = '#2b2620';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`📅 ${date.toUpperCase()}`, m + 30, m + 205);

  ctx.textAlign = 'center';
  ctx.fillText(`🏛️ ${prodi.faculty.toUpperCase()} • VOL. XXVI NO. 2026`, canvas.width / 2, m + 205);

  ctx.textAlign = 'right';
  ctx.fillText('EDISI EKSKLUSIF ADMISI & PRESTASI', canvas.width - m - 30, m + 205);

  drawDividerLine(ctx, m + 20, m + 225, canvas.width - m - 20, 3);

  // 4. Main Headline
  ctx.fillStyle = '#0f0d0b';
  ctx.font = '900 46px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';

  const headlineText = prodi.headline;
  wrapTextCentered(ctx, headlineText, canvas.width / 2, m + 285, canvas.width - (m * 2) - 80, 52);

  // Sub-Headline
  ctx.fillStyle = '#453d34';
  ctx.font = 'italic 500 25px "Georgia", serif';
  ctx.fillText(`"${prodi.subHeadline}"`, canvas.width / 2, m + 395);

  drawDividerLine(ctx, m + 100, m + 425, canvas.width - m - 100, 1);

  // 5. CENTER PHOTO (Framed in classic newsprint style)
  const photoX = m + 120;
  const photoY = m + 450;
  const photoW = canvas.width - ((m + 120) * 2);
  const photoH = 1120;

  // Photo Frame Border
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(photoX - 8, photoY - 8, photoW + 16, photoH + 16);
  ctx.strokeStyle = '#1a1815';
  ctx.lineWidth = 3;
  ctx.strokeRect(photoX - 8, photoY - 8, photoW + 16, photoH + 16);

  // Draw Photo
  drawCoverImage(ctx, img, photoX, photoY, photoW, photoH);

  // Photo Corner Accents
  ctx.strokeStyle = '#1a1815';
  ctx.lineWidth = 6;
  drawCornerAccents(ctx, photoX - 8, photoY - 8, photoW + 16, photoH + 16, 25);

  // Photo Caption Box
  const captionY = photoY + photoH + 28;
  ctx.fillStyle = '#1c1916';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  
  const guestLabel = guestName ? ` | Tokoh: ${guestName}` : '';
  ctx.fillText(`▲ DOKUMENTASI EKSKLUSIF: Potret profil transformatif mahasiswa ${prodi.name}${guestLabel}.`, photoX, captionY);

  ctx.fillStyle = '#6b5e51';
  ctx.font = 'italic 18px "Georgia", serif';
  ctx.textAlign = 'right';
  ctx.fillText('Foto & Olah Digital: AI Photobooth Studio • Dok. Redaksi', photoX + photoW, captionY);

  drawDividerLine(ctx, m + 20, captionY + 22, canvas.width - m - 20, 2);

  // 6. BOTTOM NEWS COLUMNS (2 Columns Layout)
  const colY = captionY + 45;
  const colGap = 40;
  const totalColsW = canvas.width - (m * 2) - 60;
  const colW = (totalColsW - colGap) / 2;
  const col1X = m + 30;
  const col2X = col1X + colW + colGap;

  // Vertical column divider line
  ctx.strokeStyle = '#c4b8aa';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(col1X + colW + (colGap / 2), colY);
  ctx.lineTo(col1X + colW + (colGap / 2), canvas.height - m - 120);
  ctx.stroke();

  // LEFT COLUMN: Lead Article & Quote Box
  ctx.fillStyle = '#0f0d0b';
  ctx.font = '900 26px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('BERITA UTAMA & TREN INDUSTRI', col1X, colY + 15);
  drawDividerLine(ctx, col1X, colY + 28, col1X + colW, 1.5);

  // Lead Paragraph
  ctx.fillStyle = '#26221c';
  ctx.font = '19px/1.5 "Georgia", serif';
  wrapText(ctx, prodi.leadArticle, col1X, colY + 60, colW, 30);

  // Quote Box
  const quoteBoxY = colY + 210;
  ctx.fillStyle = '#f0ede4';
  ctx.fillRect(col1X, quoteBoxY, colW, 150);
  ctx.strokeStyle = '#2b2620';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(col1X, quoteBoxY, colW, 150);

  ctx.fillStyle = '#1c1916';
  ctx.font = 'bold 22px "Georgia", serif';
  ctx.fillText('❝ KUTIPAN INSPIRATIF', col1X + 18, quoteBoxY + 34);

  ctx.fillStyle = '#3a342c';
  ctx.font = 'italic 18px "Georgia", serif';
  wrapText(ctx, prodi.quote, col1X + 18, quoteBoxY + 68, colW - 36, 26);

  // RIGHT COLUMN: Highlights, Info Box & Career Prospects
  ctx.fillStyle = '#0f0d0b';
  ctx.font = '900 26px "Playfair Display", Georgia, serif';
  ctx.fillText('KEUNGGULAN PROGRAM STUDI', col2X, colY + 15);
  drawDividerLine(ctx, col2X, colY + 28, col2X + colW, 1.5);

  // Highlights Bullets
  let curHighY = colY + 65;
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  prodi.highlights.forEach(item => {
    ctx.fillStyle = '#1a1815';
    ctx.fillText(item, col2X, curHighY);
    curHighY += 36;
  });

  // Focus Areas Box
  const focusBoxY = curHighY + 15;
  ctx.fillStyle = '#1e1b18';
  ctx.fillRect(col2X, focusBoxY, colW, 130);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 19px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`📌 ${prodi.infoBox.title}:`, col2X + 18, focusBoxY + 30);

  ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#e2ded5';
  let focusItemY = focusBoxY + 58;
  prodi.infoBox.items.forEach(item => {
    ctx.fillText(`• ${item}`, col2X + 22, focusItemY);
    focusItemY += 24;
  });

  // 7. FOOTER BARCODE & EDITORIAL CREDITS
  const footerY = canvas.height - m - 90;
  drawDoubleLine(ctx, m + 20, footerY, canvas.width - m - 20, 2, 1, 3);

  // Draw Barcode on left
  drawBarcode(ctx, m + 30, footerY + 18, 260, 45, prodi.barcodeText);

  // Center Editorial Text
  ctx.fillStyle = '#4a433a';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('© 2026 WARTA KAMPUS • PENERIMAAN MAHASISWA BARU RESMI', canvas.width / 2, footerY + 35);
  ctx.font = '500 15px "JetBrains Mono", monospace';
  ctx.fillText('DICETAK EKSKLUSIF OLEH SISTEM AI PHOTOBOOTH MULTI-MODAL', canvas.width / 2, footerY + 60);

  // Right Accreditation badge
  ctx.fillStyle = '#0f0d0b';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('⭐ AKREDITASI UNGGUL', canvas.width - m - 30, footerY + 35);
  ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#6b5e51';
  ctx.fillText('Scan QR Brosur untuk Info Lengkap', canvas.width - m - 30, footerY + 60);
}

// ----------------------------------------------------
// UTILITY DRAWING HELPERS
// ----------------------------------------------------

function drawCoverImage(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;

  let sx, sy, sw, sh;
  if (imgRatio > targetRatio) {
    sh = img.height;
    sw = img.height * targetRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = img.width / targetRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawDoubleLine(ctx, x1, y, x2, w1 = 2, w2 = 1, gap = 3) {
  ctx.strokeStyle = '#1e1b18';
  ctx.lineWidth = w1;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();

  ctx.lineWidth = w2;
  ctx.beginPath();
  ctx.moveTo(x1, y + gap);
  ctx.lineTo(x2, y + gap);
  ctx.stroke();
}

function drawDividerLine(ctx, x1, y, x2, width = 1) {
  ctx.strokeStyle = '#1e1b18';
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
}

function drawCornerAccents(ctx, x, y, w, h, len = 20) {
  // Top-left
  ctx.beginPath();
  ctx.moveTo(x, y + len);
  ctx.lineTo(x, y);
  ctx.lineTo(x + len, y);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + len);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x, y + h - len);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + len, y + h);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y + h - len);
  ctx.stroke();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
}

function wrapTextCentered(ctx, text, centerX, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), centerX, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), centerX, curY);
}

function drawBarcode(ctx, x, y, width, height, text) {
  // Procedural barcode lines
  ctx.fillStyle = '#1e1b18';
  let curX = x;
  const barPattern = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2];
  
  for (let i = 0; i < barPattern.length && curX < x + width; i++) {
    const barW = barPattern[i] * 2.5;
    ctx.fillRect(curX, y, barW, height - 14);
    curX += barW + (i % 2 === 0 ? 3 : 5);
  }

  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(text, x, y + height);
}
