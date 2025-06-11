import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  async generateQRCode(text: string): Promise<string> {
    try {
      // Returns a data URL string (base64-encoded PNG)
      return await QRCode.toDataURL(text);
    } catch (err) {
      throw new Error(`Failed to generate QR code: ${err.message}`);
    }
  }

  async generateQRCodeBuffer(text: string): Promise<Buffer> {
    try {
      return await QRCode.toBuffer(text);
    } catch (err) {
      throw new Error(`Failed to generate QR code buffer: ${err.message}`);
    }
  }

  async generateQRCodeSVG(text: string): Promise<string> {
    try {
      return await QRCode.toString(text, { type: 'svg' });
    } catch (err) {
      throw new Error(`Failed to generate QR code SVG: ${err.message}`);
    }
  }
}
