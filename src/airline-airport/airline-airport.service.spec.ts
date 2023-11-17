import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineEntity } from '../airline/airline.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirportEntity } from '../airport/airport.entity';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airline: AirlineEntity;
  let airportsList: AirportEntity[];

  const seedDatabase = async () => {
    airportRepository.clear();
    airlineRepository.clear();

    airportsList = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirportEntity = await airportRepository.save({
        name: faker.lorem.word(),
        code: faker.lorem.word({ length: 3 }),
        country: faker.location.country(),
        city: faker.location.city(),
      });
      airportsList.push(airport);
    }

    airline = await airlineRepository.save({
      name: faker.location.country(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      webpage: faker.internet.url(),
      airports: airportsList,
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    airportRepository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportAirline should add a airport to a airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.lorem.word(),
      code: faker.lorem.word({ length: 3 }),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.location.country(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      webpage: faker.internet.url(),
    });

    const result: AirlineEntity = await service.addAirportAirline(
      newAirline.id,
      newAirport.id,
    );

    expect(result.airports.length).toBe(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].name).toBe(newAirport.name);
    expect(result.airports[0].code).toBe(newAirport.code);
    expect(result.airports[0].city).toBe(newAirport.city);
    expect(result.airports[0].country).toBe(newAirport.country);
  });

  it('addAirportAirline should thrown exception for an invalid airport', async () => {
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.location.country(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      webpage: faker.internet.url(),
    });

    await expect(() =>
      service.addAirportAirline(newAirline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('addAirportAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.lorem.word(),
      code: faker.lorem.word({ length: 3 }),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    await expect(() =>
      service.addAirportAirline('0', newAirport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('findAirportByAirlineIdAirportId should return airport by airline', async () => {
    const airport: AirportEntity = airportsList[0];
    const storeAirport: AirportEntity =
      await service.findAirportByAirlineIdAirportId(airline.id, airport.id);
    expect(storeAirport).not.toBeNull();
    expect(storeAirport.name).toBe(airport.name);
    expect(storeAirport.country).toBe(airport.country);
    expect(storeAirport.code).toBe(airport.code);
    expect(storeAirport.city).toBe(airport.city);
  });

  it('findAirportByAirlineIdAirportId should throw an exception for an invalid airport', async () => {
    await expect(() =>
      service.findAirportByAirlineIdAirportId(airline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('findAirportByAirlineIdAirportId should throw an exception for an invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(() =>
      service.findAirportByAirlineIdAirportId('0', airport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('findAirportByAirlineIdAirportId should throw an exception for an airport not associated to the airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.lorem.word(),
      code: faker.lorem.word({ length: 3 }),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    await expect(() =>
      service.findAirportByAirlineIdAirportId(airline.id, newAirport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id is not associated to the airline',
    );
  });

  it('findAirportsByAirline should return recipes by airline', async () => {
    const airport: AirportEntity[] = await service.findAirportsByAirline(
      airline.id,
    );
    expect(airport.length).toBe(5);
  });

  it('findAirportsByAirline should throw an exception for an invalid airline', async () => {
    await expect(() =>
      service.findAirportsByAirline('0'),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('associateAirportsAirline should update airports list for a airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.lorem.word(),
      code: faker.lorem.word({ length: 3 }),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    const updatedAirline: AirlineEntity =
      await service.associateAirportsAirline(airline.id, [newAirport]);
    expect(updatedAirline.airports.length).toBe(1);

    expect(updatedAirline.airports[0].name).toBe(newAirport.name);
    expect(updatedAirline.airports[0].city).toBe(newAirport.city);
    expect(updatedAirline.airports[0].code).toBe(newAirport.code);
    expect(updatedAirline.airports[0].country).toBe(newAirport.country);
  });

  it('associateAirportsAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.lorem.word(),
      code: faker.lorem.word({ length: 3 }),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    await expect(() =>
      service.associateAirportsAirline('0', [newAirport]),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('associateAirportsAirline should throw an exception for an invalid airport', async () => {
    const newAirport: AirportEntity = airportsList[0];
    newAirport.id = '0';

    await expect(() =>
      service.associateAirportsAirline(airline.id, [newAirport]),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('deleteAirportAirline should remove a airport from a airline', async () => {
    const airport: AirportEntity = airportsList[0];

    await service.deleteAirportAirline(airline.id, airport.id);

    const storedAirline: AirlineEntity = await airlineRepository.findOne({
      where: { id: airline.id },
      relations: ['airports'],
    });
    const deletedAirport: AirportEntity = storedAirline.airports.find(
      (a) => a.id === airport.id,
    );

    expect(deletedAirport).toBeUndefined();
  });

  it('deleteAirportAirline should thrown an exception for an invalid airport', async () => {
    await expect(() =>
      service.deleteAirportAirline(airline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('deleteAirportAirline should thrown an exception for an invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(() =>
      service.deleteAirportAirline('0', airport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('deleteAirportAirline should thrown an exception for an non associated airport', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.lorem.word(),
      code: faker.lorem.word({ length: 3 }),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    await expect(() =>
      service.deleteAirportAirline(airline.id, newAirport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id is not associated to the airline',
    );
  });
});
