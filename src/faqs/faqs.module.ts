import { Module } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { FaqsController } from './faqs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { Faq } from '../entites/faq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Faq]), AuthModule, DatabaseServiceModule],
  controllers: [FaqsController],
  providers: [FaqsService],
})
export class FaqsModule {}
