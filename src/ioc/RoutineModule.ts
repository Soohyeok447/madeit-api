import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { RoutineSchema } from '../infrastructure/schemas/RoutineSchema';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { ProductSchema } from '../infrastructure/schemas/ProductSchema';
import { RoutineRepositoryImpl } from '../infrastructure/repositories/RoutineRepositoryImpl';
import { RoutineController } from '../adapter/controllers/RoutineController';
import { ImageRepositoryImpl } from '../infrastructure/repositories/ImageRepositoryImpl';
import { ImageProviderImpl } from '../infrastructure/providers/ImageProviderImpl';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';
import { RoutineRepository } from '../domain/repositories/routine/RoutineRepository';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { ImageRepository } from '../domain/repositories/image/ImageRepository';
import { ImageProvider } from '../domain/providers/ImageProvider';
import { RoutineService } from '../domain/use-cases/routine/service/RoutineService';
import { RoutineServiceImpl } from '../domain/use-cases/routine/service/concrete/RoutineServiceImpl';
import { AddRoutineUseCase } from '../domain/use-cases/routine/add-routine/AddRoutineUseCase';
import { UseCase } from '../domain/use-cases/UseCase';
import { GetRoutineDetailUseCase } from '../domain/use-cases/routine/get-routine-detail/GetRoutineDetailUseCase';
import { GetAllRoutinesByCategoryUseCase } from '../domain/use-cases/routine/get-all-routines-by-category/GetAllRoutinesByCategoryUseCase';
import { BuyRoutineUseCase } from '../domain/use-cases/routine/buy-routine/BuyRoutineUseCase';
import { GetAllRoutinesUseCase } from '../domain/use-cases/routine/get-all-routines/GetAllRoutinesUseCase';
import { ModifyRoutineUseCase } from '../domain/use-cases/routine/modify-routine/ModifyRoutineUseCase';

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
  controllers: [RoutineController],
  providers: [
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
      provide: UseCase,
      useClass: AddRoutineUseCase,
    },
    {
      provide: UseCase,
      useClass: ModifyRoutineUseCase,
    },
    {
      provide: UseCase,
      useClass: GetRoutineDetailUseCase,
    },
    {
      provide: UseCase,
      useClass: GetAllRoutinesUseCase,
    },
    {
      provide: UseCase,
      useClass: GetAllRoutinesByCategoryUseCase,
    },
    {
      provide: UseCase,
      useClass: BuyRoutineUseCase,
    },
  ],
  exports: [UseCase],
})
export class RoutineModule {}
