import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { Country } from './entites/country.entity';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { ProfileModule } from './profile/profile.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ClinicServicesModule } from './clinic-services/clinic-services.module';
import { UserClinic } from './entites/user-clinic.entity';
import { Visit } from './entites/visit.entity';
import { TransactionInvoice } from './entites/transaction-invoice.entity';
import { ClinicDocumentSettingModule } from './clinic-document-setting/clinic-document-setting.module';
import { ClinicDocumentSetting } from './entites/clinic-document-setting.entity';
import { DoctorSession } from './entites/doctor-session.entity';
import { ClinicSchedule } from './entites/clinic-schedule.entity';
import { SessionWeekDay } from './entites/session-week-days.entity';
import { ClinicSchedulesModule } from './clinic-schedules/clinic-schedules.module';
import { SettingsModule } from './settings/settings.module';
import { PaymentGateway } from './entites/payment-gateways.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { FaqsModule } from './faqs/faqs.module';
import { SlidersModule } from './sliders/sliders.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { FileServiceModule } from './shared/file/file.module';
import { CmsModule } from './cms/cms.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { StaffsModule } from './staffs/staffs.module';
import { Review } from './entites/review.entity';
import { DoctorHolidaysModule } from './doctor-holidays/doctor-holidays.module';
import { DoctorHoliday } from './entites/doctor-holiday.entity';
import { HelperModule } from './helper/helper.module';
import { PatientMedicalRecord } from './entites/patient-medical-record.entity';
import { AppointmentsModule } from './appointments/appointments.module';
import { VisitsModule } from './visits/visits.module';
import { SmartPatientCard } from './entites/smart-patient-card.entity';
import { SmartPatientCardsModule } from './smart-patient-cards/smart-patient-cards.module';
import { PdfService } from './pdf/pdf.service';
import { Label } from './entites/label.entity';
import { Brand } from './entites/brand.entity';
import { Medicine } from './entites/medicines.entity';
import { Category } from './entites/category.entity';
import { LabelsModule } from './labels/labels.module';
import { JwtModule } from '@nestjs/jwt';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}_${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
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
        ClinicService,
        UserClinic,
        Subscribe,
        Visit,
        ClinicSchedule,
        SessionWeekDay,
        DoctorSession,
        ClinicDocumentSetting,
        PaymentGateway,
        DoctorHoliday,
        PatientMedicalRecord,
        SmartPatientCard,
        Review,
        Label,
        Brand,
        Medicine,
        Category,
        TransactionInvoice,
      ],
      synchronize: true,
    }),
    FileServiceModule,
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
    EnquiriesModule,
    ProfileModule,
    SubscribersModule,
    ClinicServicesModule,
    ClinicDocumentSettingModule,
    ClinicSchedulesModule,
    SettingsModule,
    ServiceCategoriesModule,
    FaqsModule,
    SlidersModule,
    TestimonialsModule,
    CmsModule,
    DoctorsModule,
    PatientsModule,
    StaffsModule,
    DoctorHolidaysModule,
    HelperModule,
    AppointmentsModule,
    VisitsModule,
    SmartPatientCardsModule,
    LabelsModule,
    BrandsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PdfService],
})
export class AppModule {}
