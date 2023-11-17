import { Module } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineEntity } from '../airline/airline.entity';

@Module({
  providers: [AirlineAirportService],
  imports: [TypeOrmModule.forFeature([AirportEntity, AirlineEntity])],
})
export class AirlineAirportModule {}
