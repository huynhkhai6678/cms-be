import { Controller, Get, Param } from '@nestjs/common';
import { HelperService } from './helper.service';

@Controller('helper')
export class HelperController {

  constructor(private readonly helperService: HelperService) {}

  @Get('clinic-doctors/:id')
  async clinicDoctor(@Param('id') id: string) {
    return { 
      data: await this.helperService.clinicDoctor(+id) 
    };
  }

  @Get('clinic-patients/:id')
  async clinicPatient(@Param('id') id: string) {
    return { 
      data: await this.helperService.clinicPatient(+id) 
    };
  }

  @Get('countries')
  async getAllCountries() {
    return { 
      data: await this.helperService.getAllCountries() 
    };
  }

  @Get('states-by-country/:id')
  async getStateByCountry(@Param('id') id: string) {
    return { 
      data: await this.helperService.getStateByCountry(id)
    };
  }

  @Get('cities-by-state/:id')
  async getCityByState(@Param('id') id: string) {
    return { 
      data: await this.helperService.getCityByState(id)
    };
  }
}
