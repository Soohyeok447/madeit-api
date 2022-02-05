import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { RoutineSchema } from '../infrastructure/schemas/RoutineSchema';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { ProductSchema } from '../infrastructure/schemas/ProductSchema';
import { RoutineRepositoryImpl } from '../infrastructure/repositories/RoutineRepositoryImpl';
import { RoutineController } from '../adapter/routine/RoutineController';
import { ImageRepositoryImpl } from '../infrastructure/repositories/ImageRepositoryImpl';
import { ImageProviderImpl } from '../infrastructure/providers/ImageProviderImpl';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';
import { RoutineRepository } from '../domain/repositories/routine/RoutineRepository';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { ImageRepository } from '../domain/repositories/image/ImageRepository';
import { ImageProvider } from '../domain/providers/ImageProvider';
import { UserCommonService } from '../domain/use-cases/user/service/UserCommonService';
import { UserCommonServiceImpl } from '../domain/use-cases/user/service/concrete/UserCommonServiceImpl';
import { AddRoutineUseCaseImpl } from '../domain/use-cases/routine/add-routine/AddRoutineUseCaseImpl';
import { UseCase } from '../domain/use-cases/UseCase';
import { GetRoutineDetailUseCaseImpl } from '../domain/use-cases/routine/get-routine-detail/GetRoutineDetailUseCaseImpl';
import { GetAllRoutinesByCategoryUseCaseImpl } from '../domain/use-cases/routine/get-all-routines-by-category/GetAllRoutinesByCategoryUseCaseImpl';
import { BuyRoutineUseCaseImpl } from '../domain/use-cases/routine/buy-routine/BuyRoutineUseCaseImpl';
import { GetAllRoutinesUseCaseImpl } from '../domain/use-cases/routine/get-all-routines/GetAllRoutinesUseCaseImpl';
import { ModifyRoutineUseCaseImpl } from '../domain/use-cases/routine/modify-routine/ModifyRoutineUseCaseImpl';
import { RoutineControllerInjectedDecorator } from './controllers/routine/RoutineControllerInjectedDecorator';
import { GetRoutineDetailUseCase } from 'src/domain/use-cases/routine/get-routine-detail/GetRoutineDetailUseCase';
import { GetAllRoutinesUseCase } from 'src/domain/use-cases/routine/get-all-routines/GetAllRoutinesUseCase';
import { getAllRoutinesByCategoryUseCase } from 'src/domain/use-cases/routine/get-all-routines-by-category/GetAllRoutinesByCategoryUseCase';
import { ModifyRoutineUseCase } from 'src/domain/use-cases/routine/modify-routine/ModifyRoutineUseCase';
import { AddRoutineUseCase } from 'src/domain/use-cases/routine/add-routine/AddRoutineUseCase';
import { BuyRoutineUseCase } from 'src/domain/use-cases/routine/buy-routine/BuyRoutineUseCase';
import { PatchThumbnailUseCase } from 'src/domain/use-cases/routine/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailUseCaseImpl } from 'src/domain/use-cases/routine/patch-thumbnail/PatchThumbnailUseCaseImpl';
import { PatchCardnewsUseCase } from 'src/domain/use-cases/routine/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseImpl } from 'src/domain/use-cases/routine/patch-cardnews/PatchCardnewsUseCaseImpl';
import { RoutineCommonService } from 'src/domain/use-cases/routine/service/RoutineCommonService';
import { RoutineCommonServiceImpl } from 'src/domain/use-cases/routine/service/concrete/RoutineCommonServiceImpl';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Routine',
        schema: RoutineSchema,
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
  controllers: [RoutineControllerInjectedDecorator],
  providers: [
    {
      provide: UserCommonService,
      useClass: UserCommonServiceImpl,
    },
    {
      provide: RoutineCommonService,
      useClass: RoutineCommonServiceImpl,
    },
    {
      provide: RoutineRepository,
      useClass: RoutineRepositoryImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
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
      provide: AddRoutineUseCase,
      useClass: AddRoutineUseCaseImpl,
    },
    {
      provide: ModifyRoutineUseCase,
      useClass: ModifyRoutineUseCaseImpl,
    },
    {
      provide: GetRoutineDetailUseCase,
      useClass: GetRoutineDetailUseCaseImpl,
    },
    {
      provide: GetAllRoutinesUseCase,
      useClass: GetAllRoutinesUseCaseImpl,
    },
    {
      provide: getAllRoutinesByCategoryUseCase,
      useClass: GetAllRoutinesByCategoryUseCaseImpl,
    },
    {
      provide: BuyRoutineUseCase,
      useClass: BuyRoutineUseCaseImpl,
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
export class RoutineModule {}
