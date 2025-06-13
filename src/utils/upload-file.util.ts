import { diskStorage } from 'multer';
import { extname } from 'path';
import { ensureDirSync } from 'fs-extra';
import { Request } from 'express';

export function createFileUploadStorage(entity: string) {
  return diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void,
    ) => {
      const clinicId = req.body?.clinic_id || req['user']?.clinic_id;
      const uploadPath = `./public/uploads/${clinicId}/${entity}`;

      // Ensure the directory exists
      ensureDirSync(uploadPath);

      callback(null, uploadPath);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void,
    ) => {
      const uniqueSuffix = Date.now() + extname(file.originalname);
      callback(null, file.fieldname + '-' + uniqueSuffix);
    },
  });
}
