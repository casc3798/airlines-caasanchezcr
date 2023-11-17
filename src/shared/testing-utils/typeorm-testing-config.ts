/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../../category/category.entity';
import { CountryEntity } from '../../country/country.entity';
import { GastronomicCultureEntity } from '../../gastronomic-culture/gastronomic-culture.entity';
import { IngredientEntity } from '../../ingredient/ingredient.entity';
import { RecipeEntity } from '../../recipe/recipe.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      CategoryEntity,
      CountryEntity,
      GastronomicCultureEntity,
      IngredientEntity,
      RecipeEntity,
      RestaurantEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CategoryEntity,
    CountryEntity,
    GastronomicCultureEntity,
    IngredientEntity,
    RecipeEntity,
    RestaurantEntity,
  ]),
];
