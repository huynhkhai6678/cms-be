import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles/entities/role.entity';
import { Permission } from './roles/entities/permission.entity';
import { RoleHasPermission } from './roles/entities/role-has-permission.entity';
import { Currency } from './currencies/entities/currency.entity';
import { ClinicsModule } from './clinics/clinics.module';
import { UsersModule } from './users/users.module';
import { Clinic } from './clinics/entities/clinic.entity';
import { User } from './users/entities/user.entity';
import { Address } from './clinics/entities/address.entity';
import { UserClinic } from './clinics/entities/user-clinic.entity';
import { Doctor } from './users/entities/doctor.entity';
import { Patient } from './users/entities/patient.entity';
import { City } from './clinics/entities/city.entity';
import { State } from './clinics/entities/state.entity';
import { Country } from './clinics/entities/country.entity';
import { FrontModule } from './front/front.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      entities: [
        Role, 
        Permission, 
        RoleHasPermission,
        Currency,
        Clinic,
        User,
        Address,
        UserClinic,
        Doctor,
        Patient,
        City,
        State,
        Country
      ],
      synchronize: false,
    }),
    DashboardModule,
    AuthModule,
    CurrenciesModule,
    RolesModule,
    ClinicsModule,
    UsersModule,
    FrontModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
