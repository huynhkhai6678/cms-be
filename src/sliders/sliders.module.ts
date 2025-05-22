import { Module } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { SlidersController } from './sliders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slider } from 'src/entites/slider.entity';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseServiceModule } from 'src/shared/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Slider]),
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [SlidersController],
  providers: [SlidersService],
})
export class SlidersModule {}
