import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileUploadStorage } from '../../utils/upload-file.util';
import { documentFilter } from '../../utils/file-util';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuardFactory } from 'src/guards/role.guard.factory';

@UseGuards(AuthGuard, RoleGuardFactory('manage_patients'))
@Controller('patient-medical-record-document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createFileUploadStorage('patient-document'),
      fileFilter: documentFilter,
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const clinicId = req['user'].clinic_id;
    return {
      file_name: file.originalname,
      type: file.mimetype,
      path: `public/uploads/${clinicId}/patient-document/${file.filename}`,
    };
  }

  @Post('')
  create(@Body(ValidationPipe) createDocumentDto: CreateDocumentDto) {
    return this.documentService.create(createDocumentDto);
  }

  @Get('all/:id')
  findAll(@Param('id', ParseIntPipe) id: string) {
    return this.documentService.findAll(+id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.documentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.documentService.remove(+id);
  }
}
