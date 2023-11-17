import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class AirlineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  foundationDate: Date;

  @IsString()
  @IsNotEmpty()
  webpage: string;
}
