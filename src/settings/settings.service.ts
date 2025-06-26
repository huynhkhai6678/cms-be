import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Setting } from '../entites/setting.entity';
import { Specialization } from '../entites/specilization.entity';
import { Currency } from '../entites/currency.entity';
import {
  PAYMENT_TYPE_LIST,
  PAYMENT_TYPE_VALUE,
} from '../constants/payment.constant';
import { State } from '../entites/state.entity';
import { Country } from '../entites/country.entity';
import { City } from '../entites/city.entity';
import { UpdateContactInformationDto } from './dto/update-contact-information-setting.dto';
import { UpdateGenralDto } from './dto/update-general-setting.dto';
import { Clinic } from 'src/entites/clinic.entity';
import { Address } from 'src/entites/address.entity';
import { PaymentGateway } from 'src/entites/payment-gateways.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
    @InjectRepository(Specialization)
    private readonly specializationRepo: Repository<Specialization>,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
    @InjectRepository(Clinic)
    private readonly clinicRepo: Repository<Clinic>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(PaymentGateway)
    private readonly paymentRepo: Repository<PaymentGateway>,
  ) {}

  async findGeneralSetting(clinic_id: number) {
    const settings = await this.settingRepo.findBy({ clinic_id });
    const specializations = await this.specializationRepo.findBy({ clinic_id });
    const currencies = await this.currencyRepo.find();

    const paymentGateways = await this.paymentRepo.find({
      where: {
        clinic_id,
      },
    });
    const payments = PAYMENT_TYPE_LIST;

    const result = settings.reduce((acc, { key, value }) => {
      if (key === 'specialities' && value !== '') {
        value = JSON.parse(value);
      }
      acc[key] = value;
      return acc;
    }, {});

    return {
      data: {
        payment_gateways: paymentGateways.map((payment) => {
          return payment.payment_gateway_id;
        }),
        ...result,
      },
      specializations: specializations.map((specialization) => {
        return { label: specialization.name, value: specialization.id };
      }),
      currencies: currencies.map((currency) => {
        return { label: currency.currency_name, value: currency.id };
      }),
      payments,
    };
  }

  async findContactInformation(clinic_id: number) {
    const settings = await this.settingRepo.findBy({ clinic_id });
    const result = settings.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});

    const countries = await this.countryRepo.find();
    let states: State[] = [];
    let cities: City[] = [];
    if (result['country_id']) {
      states = await this.stateRepo.findBy({
        country_id: result['country_id'],
      });
    }

    if (result['state_id']) {
      cities = await this.cityRepo.findBy({ state_id: result['state_id'] });
    }

    return {
      data: result,
      countries,
      states,
      cities,
    };
  }

  async updateGeneralSetting(id: number, updateContactDto: UpdateGenralDto) {
    const clinic = await this.clinicRepo.findOneBy({ id });
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    for (const [key, value] of Object.entries(updateContactDto)) {
      if (key === 'specialities') {
        await this.updateSetting(id, key, JSON.stringify(value));
        continue;
      }

      if (key === 'phone') {
        await this.updatePhone(id, value);
        continue;
      }

      if (key === 'payment_gateways') {
        await this.updateGateway(id, value);
        continue;
      }

      // To do update image
      if (key != 'logo' && key != 'favicon') {
        await this.updateSetting(id, key, value);
      }
    }

    return true;
  }

  async updateContactInformation(
    id: number,
    updateContactDto: UpdateContactInformationDto,
  ) {
    const clinic = await this.clinicRepo.findOneBy({ id });
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Update setting
    for (const [key, value] of Object.entries(updateContactDto)) {
      await this.updateSetting(id, key, value);
    }

    //Update data in clinic
    const addrress = await this.addressRepo.findOne({
      where: {
        owner_id: clinic.id,
        owner_type: 'App\\Models\\Clinic',
      },
    });
    if (addrress) {
      await this.addressRepo.update(
        { id: addrress.id },
        {
          address1: updateContactDto.address_one,
          country_id: updateContactDto.country_id,
          address2: updateContactDto.address_two,
          state_id: updateContactDto.state_id,
          city_id: updateContactDto.city_id,
          postal_code: updateContactDto.postal_code,
        },
      );
    }

    return true;
  }

  async updatePhone(clinic_id, value) {
    const contact = value.e164Number.split(value.dialCode)[1];
    const region_code = value.dialCode.substring(1);
    await this.updateSetting(clinic_id, 'contact_no', contact);
    await this.updateSetting(clinic_id, 'region_code', region_code);
  }

  async updateSetting(clinic_id, key, value) {
    const setting = await this.settingRepo.findOne({
      where: {
        key,
        clinic_id,
      },
    });
    if (setting) {
      setting.value = value;
      await this.settingRepo.save(setting);
    }
  }

  async updateGateway(clinic_id, gateways) {
    const paymentGateways = await this.paymentRepo.find({
      where: {
        clinic_id,
      },
    });

    const currentGatewayIds = paymentGateways.map(
      (gateway) => gateway.payment_gateway_id,
    );
    const gatewaysToRemove = currentGatewayIds.filter(
      (id: string) => !gateways.includes(id),
    );
    const gatewaysToAdd = gateways.filter(
      (id: string) => !currentGatewayIds.includes(id),
    );

    if (gatewaysToRemove.length > 0) {
      await this.paymentRepo.delete({
        clinic_id,
        payment_gateway_id: In(gatewaysToRemove),
      });
    }

    if (gatewaysToAdd.length > 0) {
      const newGateways = gatewaysToAdd.map((id) => ({
        clinic_id,
        payment_gateway_id: id,
        payment_gateway: PAYMENT_TYPE_VALUE[id],
      }));
      await this.paymentRepo.save(newGateways);
    }
  }
}
