/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MuseumDto } from './museum.dto';
import { MuseumService } from './museum.service';

@Controller('museums')
@UseInterceptors(BusinessErrorsInterceptor)
export class MuseumController {
    constructor(private readonly museumService: MuseumService) {}

  @Get()
  async findAll() {
    return await this.museumService.findAll();
  }

  @Get(':museumId')
  async findOne(@Param('museumId') museumId: string) {
    return await this.museumService.findOne(museumId);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() museumDto: MuseumDto) {
    return await this.museumService.create(museumDto);
  }

  @Put(':museumId')
  async update(@Param('museumId') museumId: string, @Body() museumDto: MuseumDto) {
    return await this.museumService.update(museumId, museumDto);
  }

  @Delete(':museumId')
  @HttpCode(204)
  async delete(@Param('museumId') museumId: string) {
    return await this.museumService.delete(museumId);
  }

}
