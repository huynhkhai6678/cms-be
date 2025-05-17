import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entites/role.entity';
import { Permission } from './entites/permission.entity';
import { RoleHasPermission } from './entites/role-has-permission.entity';
import { Currency } from './entites/currency.entity';
import { ClinicsModule } from './clinics/clinics.module';
import { UsersModule } from './users/users.module';
import { User } from './entites/user.entity';
import { Doctor } from './entites/doctor.entity';
import { Patient } from './entites/patient.entity';
import { FrontModule } from './front/front.module';
import { StatesModule } from './states/states.module';
import { CitiesModule } from './cities/cities.module';
import { City } from './entites/city.entity';
import { State } from './entites/state.entity';
import { ClinicChainsModule } from './clinic-chains/clinic-chains.module';
import { ClinicChain } from './entites/clinic-chain.entity';
import { Setting } from './entites/setting.entity';
import { SpecilizationsModule } from './specilizations/specilizations.module';
import { ServicesModule } from './services/services.module';
import { Service } from './entites/service.entity';
import { ServiceCategory } from './entites/service-category.entity';
import { ServiceDoctor } from './entites/service-doctor.entity';
import { ClinicService } from './entites/clinic-service.entity';
import { DoctorSpecialization } from './entites/doctor-specilization.entity';
import { Specialization } from './entites/specilization.entity';
import { Appointment } from './entites/appointment.entitty';
import { FrontPatientTestimonial } from './entites/front-patient-testimonial.entity';
import { Faq } from './entites/faq.entity';
import { Enquiry } from './entites/enquiry.entity';
import { Slider } from './entites/slider.entity';
import { Subscribe } from './entites/subcriber.entity';
import { Clinic } from './entites/clinic.entity';
import { Address } from './entites/address.entity';
import { UserClinic } from './entites/user-clinic.entity';
import { Country } from './entites/country.entity';
import { EnquiriesModule } from './enquiries/enquiries.module';

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
        ClinicChain,
        User,
        Address,
        UserClinic,
        Doctor,
        Patient,
        City,
        State,
        Country,
        Setting,
        Specialization,
        Service,
        ServiceCategory,
        ServiceDoctor,
        DoctorSpecialization,
        Appointment,
        FrontPatientTestimonial,
        Faq,
        Enquiry,
        Slider,
        Subscribe,
      ],
      synchronize: false,
    }),
    DashboardModule,
    AuthModule,
    CurrenciesModule,
    RolesModule,
    ClinicsModule,
    UsersModule,
    FrontModule,
    StatesModule,
    CitiesModule,
    ClinicChainsModule,
    SpecilizationsModule,
    ServicesModule,
    ClinicService,
    EnquiriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
