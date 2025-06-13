import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  deleteFile(filePath: string) {
    const fullFilePath = path.join(__dirname, '..', filePath);

    try {
      if (fs.existsSync(fullFilePath)) {
        // If the file exists, delete it
        fs.unlinkSync(fullFilePath); // Synchronous delete
      }
    } catch (error) {
      console.log(`Error while deleting the file: ${error.message}`);
    }
  }
}
