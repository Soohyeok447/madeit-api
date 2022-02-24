import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { RoutineSchema } from '../infrastructure/schemas/RoutineSchema';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { ProductSchema } from '../infrastructure/schemas/ProductSchema';
import { RoutineRepositoryImpl } from '../infrastructure/repositories/RoutineRepositoryImpl';
import { ImageRepositoryImpl } from '../infrastructure/repositories/ImageRepositoryImpl';
import { ImageProviderImpl } from '../infrastructure/providers/ImageProviderImpl';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';
import { RoutineRepository } from '../domain/repositories/routine/RoutineRepository';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { ImageRepository } from '../domain/repositories/image/ImageRepository';
import { ImageProvider } from '../domain/providers/ImageProvider';
import { AddRoutineUseCaseImpl } from '../domain/use-cases/routine/add-routine/AddRoutineUseCaseImpl';
import { GetRoutineDetailUseCaseImpl } from '../domain/use-cases/routine/get-routine/GetRoutineUseCaseImpl';
import { GetAllRoutinesUseCaseImpl } from '../domain/use-cases/routine/get-routines/GetRoutinesUseCaseImpl';
import { ModifyRoutineUseCaseImpl } from '../domain/use-cases/routine/modify-routine/ModifyRoutineUseCaseImpl';
import { RoutineControllerInjectedDecorator } from './controllers/routine/RoutineControllerInjectedDecorator';
import { GetRoutineUseCase } from '../domain/use-cases/routine/get-routine/GetRoutineUseCase';
import { GetRoutinesUseCase } from '../domain/use-cases/routine/get-routines/GetRoutinesUseCase';
import { ModifyRoutineUseCase } from '../domain/use-cases/routine/modify-routine/ModifyRoutineUseCase';
import { AddRoutineUseCase } from '../domain/use-cases/routine/add-routine/AddRoutineUseCase';
import { CommonRoutineService } from '../domain/use-cases/routine/service/CommonRoutineService';
import { CommonUserService } from '../domain/use-cases/user/service/CommonUserService';
import { MomentProvider } from '../domain/providers/MomentProvider';
import { MomentProviderImpl } from '../infrastructure/providers/MomentProviderImpl';

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
    CommonUserService,
    CommonRoutineService,
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
      provide: GetRoutineUseCase,
      useClass: GetRoutineDetailUseCaseImpl,
    },
    {
      provide: GetRoutinesUseCase,
      useClass: GetAllRoutinesUseCaseImpl,
    },
    {
      provide: MomentProvider,
      useClass: MomentProviderImpl,
    },
  ],
  exports: [],
})
export class RoutineModule { }
