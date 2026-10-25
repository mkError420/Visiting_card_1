import QRCode from 'qrcode';
import { Participant } from '../types';
import { toBengaliNumber, EVENT_DETAILS } from './bengali';

export interface DecodedQRData {
  regNo: string;
  name: string;
  school: string;
  address: string;
  relation: string;
  event: string;
  date: string;
  venue: string;
  verified: boolean;
  issuedAt?: string;
  raw?: string;
}

export function generateQrPayload(participant: Participant): string {
  const payload = {
    v: '1.0',
    event: 'SSC 88 Batch Reunion - বাহের ডাক',
    regNo: toBengaliNumber(participant.regNo),
    regNoEn: String(participant.regNo).padStart(3, '0'),
    name: participant.name,
    school: participant.school,
    address: participant.address,
    // Critical requirement: Relation is strictly encoded inside the QR payload!
    relation: participant.relation,
    date: EVENT_DETAILS.date,
    venue: EVENT_DETAILS.venue,
    verified: true,
    issuedAt: participant.createdAt || new Date().toISOString(),
  };

  return JSON.stringify(payload);
}

export async function generateQrDataUrl(participant: Participant): Promise<string> {
  const payload = generateQrPayload(participant);
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
      color: {
        dark: '#052e16', // Deep forest emerald green/black
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR Code data URL:', err);
    return '';
  }
}

export function parseQrPayload(text: string): DecodedQRData | null {
  try {
    const data = JSON.parse(text);
    if (data && data.name && data.relation) {
      return {
        regNo: data.regNo || data.regNoEn || '',
        name: data.name,
        school: data.school || '',
        address: data.address || '',
        relation: data.relation,
        event: data.event || 'SSC 88 Batch Reunion',
        date: data.date || EVENT_DETAILS.date,
        venue: data.venue || EVENT_DETAILS.venue,
        verified: Boolean(data.verified),
        issuedAt: data.issuedAt,
        raw: text,
      };
    }
  } catch {
    // If it's plain text format
    if (text.includes('সম্পর্ক:') || text.includes('নাম:')) {
      const getVal = (prefix: string) => {
        const line = text.split('\n').find(l => l.includes(prefix));
        return line ? line.split(prefix)[1]?.trim() : '';
      };
      return {
        regNo: getVal('নিবন্ধন নং:') || '---',
        name: getVal('নাম:') || 'অজ্ঞাত',
        school: getVal('স্কুল:') || '',
        address: getVal('ঠিকানা:') || '',
        relation: getVal('সম্পর্ক:') || 'নিজে',
        event: 'এসএসসি ৮৮ ব্যাচের বন্ধুদের মিলনমেলা',
        date: EVENT_DETAILS.date,
        venue: EVENT_DETAILS.venue,
        verified: true,
        raw: text,
      };
    }
  }
  return null;
}
