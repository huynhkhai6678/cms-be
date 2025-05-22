import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontPatientTestimonial } from '../entites/front-patient-testimonial.entity';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { FileServiceModule } from '../shared/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FrontPatientTestimonial]),
    AuthModule,
    DatabaseServiceModule,
    FileServiceModule,
  ],
  controllers: [TestimonialsController],
  providers: [TestimonialsService],
})
export class TestimonialsModule {}
