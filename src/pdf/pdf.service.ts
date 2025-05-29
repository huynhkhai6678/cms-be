import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
    async createPdfFromHtml(htmlContent: string): Promise<Buffer> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
        });

        // Generate the PDF
        const pdfUint8Array  = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                bottom: '20mm',
                left: '10mm',
                right: '10mm',
            },
        });

        const pdfBuffer = Buffer.from(pdfUint8Array);

        await browser.close();
        
        return pdfBuffer;
  }
}
