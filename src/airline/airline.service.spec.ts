/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirlineEntity } from './airline.entity';
import { AirlineService } from './airline.service';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlinesList;

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];
    for (let i = 0; i < 5; i++) {
      const airline: AirlineEntity = await repository.save({
        name: faker.location.country(),
        description: faker.lorem.sentence(),
        foundationDate: faker.date.past(),
        webpage: faker.internet.url(),
      });
      airlinesList.push(airline);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it('findOne should return an airline by id', async () => {
    const storedAirline: AirlineEntity = airlinesList[0];
    const airline: AirlineEntity = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name);
    expect(airline.description).toEqual(storedAirline.description);
    expect(airline.foundationDate).toEqual(storedAirline.foundationDate);
    expect(airline.webpage).toEqual(storedAirline.webpage);
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: '',
      name: faker.location.country(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      webpage: faker.internet.url(),
    } as AirlineEntity;

    const newAirline: AirlineEntity = await service.create(airline);
    expect(newAirline).not.toBeNull();

    const storedAirline: AirlineEntity = await repository.findOne({
      where: { id: newAirline.id },
    });
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(newAirline.name);
    expect(storedAirline.description).toEqual(newAirline.description);
    expect(storedAirline.foundationDate).toEqual(newAirline.foundationDate);
    expect(storedAirline.webpage).toEqual(newAirline.webpage);
  });

  it('create should throw if foundation date is not in the past', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const airline: AirlineEntity = {
      id: '',
      name: faker.location.country(),
      description: faker.lorem.sentence(),
      foundationDate: tomorrow,
      webpage: faker.internet.url(),
    } as AirlineEntity;

    await expect(() => service.create(airline)).rejects.toHaveProperty(
      'message',
      'The foundation date must be in the past',
    );
  });

  it('update should modify a airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.name = 'New name';
    const updatedAirline: AirlineEntity = await service.update(
      airline.id,
      airline,
    );
    expect(updatedAirline).not.toBeNull();
    const storedAirline: AirlineEntity = await repository.findOne({
      where: { id: airline.id },
    });
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(airline.name);
  });

  it('update should throw if the foundation date is in the future', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const airline: AirlineEntity = airlinesList[0];
    airline.foundationDate = tomorrow;

    await expect(() =>
      service.update(airline.id, airline),
    ).rejects.toHaveProperty(
      'message',
      'The foundation date must be in the past',
    );
  });

  it('update should throw an exception for an invalid airline', async () => {
    let airline: AirlineEntity = airlinesList[0];
    airline = {
      ...airline,
      name: 'New name',
    };
    await expect(() => service.update('0', airline)).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('delete should remove a airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);
    const deletedAirline: AirlineEntity = await repository.findOne({
      where: { id: airline.id },
    });
    expect(deletedAirline).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });
});
