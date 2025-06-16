import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from '../auth/auth.module';
import { Notification } from '../entites/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification
    ]),
    AuthModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationGateway, NotificationService],
  exports : [NotificationService],
})
export class NotificationModule {}
