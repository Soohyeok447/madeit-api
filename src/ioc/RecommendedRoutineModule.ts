import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { ProductSchema } from '../infrastructure/schemas/ProductSchema';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';
import { ImageRepository } from '../domain/repositories/image/ImageRepository';
import { ImageRepositoryImpl } from '../infrastructure/repositories/ImageRepositoryImpl';
import { ImageProvider } from '../domain/providers/ImageProvider';
import { ImageProviderImpl } from '../infrastructure/providers/ImageProviderImpl';
import { RecommendedRoutineSchema } from '../infrastructure/schemas/RecommendedRoutineSchema';
import { RecommendedRoutineRepository } from '../domain/repositories/recommended-routine/RecommendedRoutineRepository';
import { RecommendedRoutineRepositoryImpl } from '../infrastructure/repositories/RecommendedRoutineRepositoryImpl';
import { RecommendedRoutineControllerInjectedDecorator } from './controllers/recommended-routine/RecommendRoutineControllerInjectedSwagger';
import { AddRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCaseImpl';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'RecommendedRoutine',
        schema: RecommendedRoutineSchema,
      },
      {
        name: 'Product',
        schema: ProductSchema,
      },
      {
        name: 'Image',
        schema: ImageSchema,
      },
    ]),
  ],
  controllers: [RecommendedRoutineControllerInjectedDecorator],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: RecommendedRoutineRepository,
      useClass: RecommendedRoutineRepositoryImpl,
    },
    {
      provide: ImageRepository,
      useClass: ImageRepositoryImpl,
    },
    {
      provide: ImageProvider,
      useClass: ImageProviderImpl,
    },
    {
      provide: AddRecommendedRoutineUseCase,
      useClass: AddRecommendedRoutineUseCaseImpl,
    },
  ],
  exports: [],
})
export class RecommendedRoutineModule {}
