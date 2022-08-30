/* eslint-disable prettier/prettier */
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumEntity } from './museum.entity';
import { MuseumService } from './museum.service';
import { MuseumController } from './museum.controller';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([MuseumEntity]), CacheModule.register({
    store: sqliteStore, 
      options: {
        ttl: 5
      },
      path: ':memory:'
  })],
  providers: [MuseumService],
  controllers: [MuseumController],
})
export class MuseumModule {}
