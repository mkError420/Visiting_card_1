import { Participant } from '../types';
import { toBengaliNumber } from './bengali';
import { generateQrDataUrl } from './qrPayload';

const TEMPLATE_SRC = '/assets/aistudio/WhatsApp-Image-2026-10-25-at-4.00_417cf231.png';

export async function renderCardToCanvas(participant: Participant): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d canvas context');

  // 1. Draw Template Background
  const bgImg = await loadImage(TEMPLATE_SRC);
  ctx.drawImage(bgImg, 0, 0, 1024, 1536);

  // 2. Draw Circular Photo if available
  if (participant.photoUrl) {
    try {
      const userImg = await loadImage(participant.photoUrl);
      ctx.save();
      // Circle coordinates from exact template detection
      const cx = 250;
      const cy = 774;
      const radius = 188;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Cover-fit image in the square bbox
      const imgW = userImg.naturalWidth || userImg.width;
      const imgH = userImg.naturalHeight || userImg.height;
      const minDim = Math.min(imgW, imgH);
      const sx = (imgW - minDim) / 2;
      const sy = (imgH - minDim) / 2;

      ctx.drawImage(
        userImg,
        sx,
        sy,
        minDim,
        minDim,
        cx - radius,
        cy - radius,
        radius * 2,
        radius * 2
      );

      ctx.restore();
    } catch (e) {
      console.warn('Failed to draw user photo on canvas:', e);
    }
  } else {
    // Draw "Set image here" inside circle when no photo is uploaded
    ctx.save();
    ctx.fillStyle = '#064e3b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Set image here', 250, 774);
    ctx.restore();
  }

  // 3. Render Dynamic Text Fields
  // Setting up Bengali typography
  ctx.fillStyle = '#0f172a';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  // Row 1: Name (নাম)
  ctx.font = 'bold 46px "Hind Siliguri", "Anek Bangla", sans-serif';
  const nameText = participant.name || 'নাম লিখুন';
  ctx.fillText(truncateText(ctx, nameText, 420), 560, 656);

  // Row 2: School (স্কুল)
  ctx.font = '600 39px "Hind Siliguri", "Anek Bangla", sans-serif';
  const schoolText = participant.school || 'স্কুলের নাম লিখুন';
  ctx.fillText(truncateText(ctx, schoolText, 420), 560, 759);

  // Row 3: Address (ঠিকানা)
  ctx.font = '600 38px "Hind Siliguri", "Anek Bangla", sans-serif';
  const addressText = participant.address || 'ঠিকানা লিখুন';
  ctx.fillText(truncateText(ctx, addressText, 420), 560, 862);

  // Row 4: Registration No (নিবন্ধন নং)
  ctx.font = 'bold 44px "Hind Siliguri", "Anek Bangla", sans-serif';
  const regNumberBengali = toBengaliNumber(participant.regNo);
  const regText = `নিবন্ধন নং- ${regNumberBengali}`;
  ctx.fillText(regText, 560, 965);

  // 4. Render QR Code (Relation is solely stored in QR code payload!)
  try {
    const qrDataUrl = await generateQrDataUrl(participant);
    if (qrDataUrl) {
      const qrImg = await loadImage(qrDataUrl);
      // Full fill the white box area in footer: x=835..989 (w=154px), y=1333..1481 (h=148px)
      ctx.drawImage(qrImg, 835, 1333, 154, 148);
    }
  } catch (err) {
    console.error('Failed to draw QR code on canvas:', err);
  }

  return canvas;
}

export async function downloadCardAsPng(participant: Participant) {
  const canvas = await renderCardToCanvas(participant);
  const link = document.createElement('a');
  const safeName = (participant.name || 'attendee').replace(/\s+/g, '_');
  link.download = `ID_Card_SSC88_Reg_${toBengaliNumber(participant.regNo)}_${safeName}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = err => reject(err);
    img.src = src;
  });
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let str = text;
  while (str.length > 0 && ctx.measureText(str + '...').width > maxWidth) {
    str = str.slice(0, -1);
  }
  return str + '...';
}
