import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';
import { AirlineAirportModule } from './airline-airport/airline-airport.module';
import { AirportEntity } from './airport/airport.entity';
import { AirlineEntity } from './airline/airline.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AirlineModule,
    AirportModule,
    AirlineAirportModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'airlines',
      entities: [AirportEntity, AirlineEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
