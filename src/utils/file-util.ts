import { BadRequestException } from '@nestjs/common';

export const fileFilter = (req, file, callback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestException('Only JPEG, PNG, or JPG files are allowed'),
      false,
    );
  }
};
