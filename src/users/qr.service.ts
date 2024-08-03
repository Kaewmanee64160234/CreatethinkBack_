import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode';

@Injectable()
export class QrService {
  async generateQr(link: string): Promise<string> {
    try {
      const qrCodeDataUrl = await qrcode.toDataURL(link);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }
}
