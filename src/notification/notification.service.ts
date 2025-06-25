import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entites/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import * as moment from 'moment';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class NotificationService {
    constructor(
        private readonly gateway: WebsocketGateway,
        @InjectRepository(Notification) private notificationRepo: Repository<Notification>,
    ) {}

    async create(createNotificationDto: CreateNotificationDto) {
        const notification = this.notificationRepo.create(createNotificationDto);
        await this.notificationRepo.save(notification);
        return this.gateway.sendToUser(createNotificationDto.user_id.toString(), 'notification',createNotificationDto);
    }
    
    async findAll(userId : number) {
        return {
            data: await this.notificationRepo.find({
                where: {
                    user_id: userId,
                },
                order: {
                    created_at: 'DESC',
                },
            })
        }
    }
    
    async findOne(id: number) {
        const notification = await this.notificationRepo.findOneBy({ id });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        return {
            data: notification,
        };
    }

    async readOne(id: number) {
        const notification = await this.notificationRepo.findOneBy({ id });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        notification.read_at = moment().toDate();

        return {
            data: await this.notificationRepo.save(notification),
        };
    }

    async readAll(id: number) {
        const now = moment().toDate();

        await this.notificationRepo
            .createQueryBuilder()
            .update()
            .set({ read_at: now })
            .where('user_id = :id', { id })
            .andWhere('read_at IS NULL')
            .execute();

        return { message: 'All notifications marked as read' };
    }
    
    async remove(id: number) {
        const notification = await this.notificationRepo.findOneBy({ id });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        await this.notificationRepo.remove(notification);
    }
}
