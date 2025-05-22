import { Module } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { EnquiriesController } from './enquiries.controller';
import { Enquiry } from '../entites/enquiry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enquiry]),
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [EnquiriesController],
  providers: [EnquiriesService],
})
export class EnquiriesModule {}
