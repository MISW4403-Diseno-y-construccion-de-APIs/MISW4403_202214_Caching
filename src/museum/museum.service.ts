/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MuseumEntity } from './museum.entity';

@Injectable()
export class MuseumService {

    cacheKey: string = "artists";
    
    constructor(
        @InjectRepository(MuseumEntity)
        private readonly museumRepository: Repository<MuseumEntity>,
        @Inject(CACHE_MANAGER) 
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<MuseumEntity[]> {
        const cached: MuseumEntity[] = await this.cacheManager.get<MuseumEntity[]>(this.cacheKey);
        
        if(!cached){
            const museums: MuseumEntity[] = await this.museumRepository.find({ relations: ["artworks", "exhibitions"] });
            await this.cacheManager.set(this.cacheKey, museums);
            return museums;
        }

        return cached;
    }

    async findOne(id: string): Promise<MuseumEntity> {
        const museum: MuseumEntity = await this.museumRepository.findOne({where: {id}, relations: ["artworks", "exhibitions"] } );
        if (!museum)
          throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
    
        return museum;
    }
    
    async create(museum: MuseumEntity): Promise<MuseumEntity> {
        return await this.museumRepository.save(museum);
    }

    async update(id: string, museum: MuseumEntity): Promise<MuseumEntity> {
        const persistedMuseum: MuseumEntity = await this.museumRepository.findOne({where:{id}});
        if (!persistedMuseum)
          throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
        
        museum.id = id;  
        
        return await this.museumRepository.save(museum);
    }

    async delete(id: string) {
        const museum: MuseumEntity = await this.museumRepository.findOne({where:{id}});
        if (!museum)
          throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
      
        await this.museumRepository.remove(museum);
    }
}
