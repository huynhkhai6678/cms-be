import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from '../entites/setting.entity';
import { Repository } from 'typeorm';
import { User } from '../entites/user.entity';
import { Service } from '../entites/service.entity';
import { Doctor } from '../entites/doctor.entity';
import { Specialization } from '../entites/specilization.entity';
import { FrontPatientTestimonial } from '../entites/front-patient-testimonial.entity';
import { Slider } from '../entites/slider.entity';
import { Clinic } from '../entites/clinic.entity';

@Injectable()
export class FrontService {

    constructor(
        @InjectRepository(Setting) private settingRepo: Repository<Setting>,
        @InjectRepository(Clinic) private clinicRepo: Repository<Clinic>,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Service) private serviceRepo: Repository<Service>,
        @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
        @InjectRepository(FrontPatientTestimonial) private testimominalRepo: Repository<FrontPatientTestimonial>,
        @InjectRepository(Specialization) private specilizationRepo: Repository<Specialization>,
        @InjectRepository(Slider) private sliderRepo: Repository<Slider>,
    ) {}

    async getSettings(query) {
        const clinic = await this.clinicRepo.findOneBy({ landing_name : query.name });
        if (!clinic) throw new NotFoundException('Invalid clinic');

        const settings = await this.settingRepo.findBy({
            clinic_id : clinic.id 
        });

        let data = {};
            settings.forEach(setting => {
            data[setting.key] = setting.value;
        });
        data['clinic_id'] = clinic.id;

        return {
            data
        }
    }

    async getServices(clinic_id) {
        return {
            data : await this.serviceRepo.find({
                where: {
                    clinic_id,
                    status : true
                }
            })
        }
    }

    async getServiceCounter(clinicId: number) {
        const patientCount = await this.userRepo.count({
            where: {
                clinic_id : clinicId,
                type : 3
            }
        });
        const specializationCount = await this.specilizationRepo.countBy({ clinic_id : clinicId });
        const serviceCount  = await this.serviceRepo.count({
            where: {
                clinic_id : clinicId,
                status : true
            }
        });

        const doctorCount = await this.doctorRepo
            .createQueryBuilder('doctor')
            .innerJoin('doctor.user', 'user')
            .innerJoin('user.userClinics', 'userClinic', 'userClinic.clinic_id = :clinicId', { clinicId })
            .getCount();

        return {
            data : {
                'patients': patientCount,
                'specializations' : specializationCount,
                'services' : serviceCount,
                'doctors' : doctorCount
            }
        }
    }

    async getDoctors(clinic_id) {
        const doctors = await this.doctorRepo
            .createQueryBuilder('doctor')
            .innerJoinAndSelect('doctor.user', 'user', 'user.status = :status', { status: 1 })
            .innerJoin('user.userClinics', 'userClinic', 'userClinic.clinic_id = :clinic_id', { clinic_id })
            .leftJoinAndSelect('doctor.doctorSpecializations', 'doctorSpecialization')
            .leftJoinAndSelect('doctorSpecialization.specialization', 'specialization')
            .getMany();

        const data = doctors.map((doctor) => {
            const user = doctor.user;
            const minSpecialization = doctor.doctorSpecializations.reduce((min : any, ds) => {
                if (!min || (ds.specialization && ds.specialization.id < min.id)) return ds.specialization;
                return min;
            }, null);
            return {
                user_id: user.id,
                doctor_id: doctor.id,
                name: `${user.first_name} ${user.last_name}`,
                specialization: minSpecialization?.name,
                avatar: 'web/media/avatars/male.png' // Replace with actual avatar path if available
            };
        });

        return {
            data
        }
    }

    async getTopDoctors(clinicId) {
        const topDoctors = await this.doctorRepo
            .createQueryBuilder('doctor')
            .leftJoinAndSelect('doctor.user', 'user', 'user.status = 1')
            .leftJoinAndSelect('user.userClinics', 'userClinic', 'userClinic.clinic_id = :clinicId', { clinicId })
            .leftJoinAndSelect('doctor.doctorSpecializations', 'doctorSpecialization')
            .leftJoinAndSelect('doctorSpecialization.specialization', 'specialization')
            .leftJoin('doctor.appointments', 'appointment')
            .addSelect('COUNT(appointment.id)', 'appointmentCount')
            .groupBy('doctor.id')
            .addGroupBy('user.id')
            .addGroupBy('doctorSpecialization.id')
            .addGroupBy('specialization.id')
            .orderBy('appointmentCount', 'DESC')
            .limit(3)
            .getMany();

        const data = topDoctors.map((doctor) => {
            const user = doctor.user;
            const minSpecialization = doctor.doctorSpecializations.reduce((min: any, ds) => {
            if (!min || ds.specialization.id < min.id) return ds.specialization;
            return min;
            }, null);

            return {
                user_id: user.id,
                doctor_id: doctor.id,
                name: `${user.first_name} ${user.last_name}`,
                specialization: minSpecialization?.name,
                avatar: 'web/media/avatars/male.png', // TODO: replace with actual media if exists
            };
        });

        return {
            data
        }
    }

    async getFrontTestimonials(clinicId) {
        return {
            data : await this.testimominalRepo.find({
                where: {
                    clinic_id : clinicId,
                }
            })
        }
    }

    async getLanding(clinicId) {
        return {
            slider : await this.sliderRepo.findOneBy({
                clinic_id : clinicId,
            }),
            services : await this.serviceRepo.findBy({
                clinic_id : clinicId,
            })
        }
    }
}
