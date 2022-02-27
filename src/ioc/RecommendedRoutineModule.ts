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
import { ModifyRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCaseImpl';
import { CommonRecommendedRoutineService } from '../domain/use-cases/recommended-routine/service/CommonRecommendedRoutineService';
import { DeleteRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { GetRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCase';
import { GetRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCaseImpl';
import { GetRecommendedRoutinesUseCase } from '../domain/use-cases/recommended-routine/get-recommended-routines/GetRecommendedRoutinesUseCase';
import { GetRecommendedRoutinesUseCaseImpl } from '../domain/use-cases/recommended-routine/get-recommended-routines/GetRecommendedRoutinesUseCaseImpl';
import { PatchThumbnailUseCase } from '../domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailUseCaseImpl } from '../domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCaseImpl';
import { PatchCardnewsUseCase } from '../domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseImpl } from '../domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCaseImpl';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Recommended-Routine',
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
    {
      provide: ModifyRecommendedRoutineUseCase,
      useClass: ModifyRecommendedRoutineUseCaseImpl,
    },
    {
      provide: DeleteRecommendedRoutineUseCase,
      useClass: DeleteRecommendedRoutineUseCaseImpl,
    },
    {
      provide: GetRecommendedRoutineUseCase,
      useClass: GetRecommendedRoutineUseCaseImpl,
    },
    {
      provide: GetRecommendedRoutinesUseCase,
      useClass: GetRecommendedRoutinesUseCaseImpl,
    },
    {
      provide: PatchThumbnailUseCase,
      useClass: PatchThumbnailUseCaseImpl,
    },
    {
      provide: PatchCardnewsUseCase,
      useClass: PatchCardnewsUseCaseImpl,
    },
  ],
  exports: [],
})
export class RecommendedRoutineModule {}
