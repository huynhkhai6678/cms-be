import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscribe } from '../entites/subcriber.entity';
import { DatabaseServiceModule } from 'src/shared/database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscribe]), DatabaseServiceModule],
  controllers: [SubscribersController],
  providers: [SubscribersService],
})
export class SubscribersModule {}
