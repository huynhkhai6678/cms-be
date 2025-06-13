import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { I18nService } from 'nestjs-i18n';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private i18n: I18nService,
  ) {}

  @Post()
  async create(@Body(ValidationPipe) createRoleDto: CreateRoleDto) {
    const result = await this.rolesService.create(createRoleDto);
    if (!result) {
      throw new BadRequestException('Error');
    }
    return {
      message: this.i18n.t('main.messages.flash.role_create'),
    };
  }

  @Get()
  async findAll(@Query() query) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body(ValidationPipe) updateRoleDto: UpdateRoleDto,
  ) {
    const result = await this.rolesService.update(+id, updateRoleDto);
    if (!result) {
      throw new BadRequestException('Error');
    }
    return {
      message: this.i18n.t('main.messages.flash.role_create'),
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.rolesService.remove(+id);
    return {
      message: this.i18n.t('main.messages.flash.role_delete'),
    };
  }
}
