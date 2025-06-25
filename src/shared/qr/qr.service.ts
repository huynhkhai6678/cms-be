import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  async generateQRCode(text: string): Promise<string> {
    try {
      // Returns a data URL string (base64-encoded PNG)
      const result: string = await QRCode.toDataURL(text);
      return result;
    } catch (err) {
      throw new Error(`Failed to generate QR code: ${err}`);
    }
  }

  async generateQRCodeBuffer(text: string): Promise<Buffer> {
    try {
      const buffer: Buffer = await QRCode.toBuffer(text);
      return buffer;
    } catch (err) {
      throw new Error(`Failed to generate QR code buffer: ${err.message}`);
    }
  }

  async generateQRCodeSVG(text: string): Promise<string> {
    try {
      const svg: string = await QRCode.toString(text, { type: 'svg' });
      return svg;
    } catch (err) {
      throw new Error(`Failed to generate QR code SVG: ${err.message}`);
    }
  }
}
