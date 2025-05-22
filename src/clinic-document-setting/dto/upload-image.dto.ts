import { IsNotEmpty, Matches } from 'class-validator';

export class UploadImageDto {
  @IsNotEmpty({ message: 'File is required' })
  @Matches(/\.(jpeg|png)$/i, {
    message: 'Only jpeg and png images are allowed',
  }) // Mime type validation
  upload;
}
