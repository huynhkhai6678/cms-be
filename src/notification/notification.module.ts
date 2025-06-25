import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthModule } from '../auth/auth.module';
import { Notification } from '../entites/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification
    ]),
    AuthModule,
    WebsocketModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports : [NotificationService],
})
export class NotificationModule {}
