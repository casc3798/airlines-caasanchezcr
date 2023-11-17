import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Airport } from '../airport/airport.entity';

@Entity()
export class Airline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  foundationDate: Date;

  @Column()
  webpage: string;

  @ManyToMany(() => Airport, (airport) => airport.airlines)
  airports: Airport[];
}
