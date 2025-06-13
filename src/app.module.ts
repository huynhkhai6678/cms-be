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
import { PdfService } from './shared/pdf/pdf.service';
import { Label } from './entites/label.entity';
import { Brand } from './entites/brand.entity';
import { Medicine } from './entites/medicine.entity';
import { Category } from './entites/category.entity';
import { LabelsModule } from './labels/labels.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { MedicinesModule } from './medicines/medicines.module';
import { MedicineCategory } from './entites/medicine-categories.entity';
import { MedicineBrand } from './entites/medicine-brands.entity';
import { MedicineInventoriesModule } from './medicine-inventories/medicine-inventories.module';
import { MedicineInventory } from './entites/medicine-inventory.entity';
import { MedicineInventoryUsage } from './entites/medicine-inventory-usage.entity';
import { MedicineInventoryUsagesModule } from './medicine-inventory-usages/medicine-inventory-usages.module';
import { PurchaseMedicine } from './entites/purchase-medicines.entity';
import { PurchasedMedicine } from './entites/purchased-medicines.entity';
import { MedicinePurchaseModule } from './medicine-purchase/medicine-purchase.module';
import { ExcelService } from './shared/excel/excel.service';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionInvoiceReceipt } from './entites/transaction-invoice-receipt.entity';
import { TransactionInvoiceService } from './entites/transaction-invoice-service.entity';
import { TransactionMedicalCertificate } from './entites/transaction-medical-certificate.entity';
import { TransactionMedicalCertificateModule } from './transaction-medical-certificate/transaction-medical-certificate.module';
import { ReportsModule } from './reports/reports.module';
import { QrService } from './shared/qr/qr.service';
import { MedicalRecordModule } from './medical-record/medical-record/medical-record.module';
import { PatientMedicalRecordBloodPressure } from './entites/patient-medical-record-blood-pressure.entity';
import { PatientMedicalRecordDocument } from './entites/patient-medical-record-document.entity';
import { PatientMedicalRecordHistory } from './entites/patient-medical-record-history.entity';
import { PatientMedicalRecordPulseRate } from './entites/patient-medical-record-pulse-rate.entity';
import { PatientMedicalRecordTemperature } from './entites/patient-medical-record-pulse-temperature.entity';
import { PatientMedicalRecordWeight } from './entites/patient-medical-record-pulse-weight.entity';
import { BloodPressureModule } from './medical-record/blood-pressure/blood-pressure.module';
import { TemperatureModule } from './medical-record/temperature/temperature.module';
import { PulseRateModule } from './medical-record/pulse-rate/pulse-rate.module';
import { WeightModule } from './medical-record/weight/weight.module';
import { DocumentModule } from './medical-record/document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
        PatientMedicalRecordBloodPressure,
        PatientMedicalRecordDocument,
        PatientMedicalRecordHistory,
        PatientMedicalRecordPulseRate,
        PatientMedicalRecordTemperature,
        PatientMedicalRecordWeight,
        SmartPatientCard,
        Review,
        Label,
        Brand,
        Medicine,
        Category,
        TransactionInvoice,
        TransactionInvoiceReceipt,
        TransactionInvoiceService,
        TransactionMedicalCertificate,
        MedicineBrand,
        MedicineCategory,
        MedicineInventory,
        MedicineInventoryUsage,
        PurchaseMedicine,
        PurchasedMedicine,
      ],
      synchronize: false,
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
    MedicinesModule,
    MedicineInventoriesModule,
    MedicineInventoryUsagesModule,
    MedicinePurchaseModule,
    TransactionsModule,
    TransactionMedicalCertificateModule,
    ReportsModule,
    MedicalRecordModule,
    BloodPressureModule,
    TemperatureModule,
    PulseRateModule,
    WeightModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService, PdfService, ExcelService, QrService],
})
export class AppModule {}
