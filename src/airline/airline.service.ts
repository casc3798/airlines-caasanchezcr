import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';
import { Repository } from 'typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,
  ) {}

  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineRepository.find({
      relations: ['airports'],
    });
  }

  async findOne(id: string): Promise<AirlineEntity> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return airline;
  }

  async create(airline: AirlineEntity): Promise<AirlineEntity> {
    const currentDate = new Date();

    if (airline.foundationDate >= currentDate)
      throw new BusinessLogicException(
        'The foundation date must be in the past',
        BusinessError.BAD_REQUEST,
      );

    return await this.airlineRepository.save(airline);
  }

  async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
    const persistedAirline: AirlineEntity =
      await this.airlineRepository.findOne({ where: { id } });

    if (!persistedAirline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const currentDate = new Date();
    if (airline.foundationDate >= currentDate)
      throw new BusinessLogicException(
        'The foundation date must be in the past',
        BusinessError.BAD_REQUEST,
      );

    return await this.airlineRepository.save({
      ...persistedAirline,
      ...airline,
    });
  }

  async delete(id: string) {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id },
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.airlineRepository.remove(airline);
  }
}
