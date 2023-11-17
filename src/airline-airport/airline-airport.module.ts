import { Module } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineEntity } from '../airline/airline.entity';
import { AirlineAirportController } from './airline-airport.controller';

@Module({
  providers: [AirlineAirportService],
  imports: [TypeOrmModule.forFeature([AirportEntity, AirlineEntity])],
  controllers: [AirlineAirportController],
})
export class AirlineAirportModule {}
