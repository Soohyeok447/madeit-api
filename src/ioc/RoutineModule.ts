import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { RoutineSchema } from '../infrastructure/schemas/RoutineSchema';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { RoutineRepositoryImpl } from '../infrastructure/repositories/RoutineRepositoryImpl';
import { RoutineRepository } from '../domain/repositories/routine/RoutineRepository';
import { UserRepository } from '../domain/repositories/user/UserRepository';
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
import { ToggleActivationUseCase } from '../domain/use-cases/routine/toggle-activation/ToggleActivationUseCase';
import { ToggleActivationUseCaseImpl } from '../domain/use-cases/routine/toggle-activation/ToggleActivationUseCaseImpl';
import { DeleteRoutineUseCase } from '../domain/use-cases/routine/delete-routine/DeleteRoutineUseCase';
import { DeleteRoutineUseCaseImpl } from '../domain/use-cases/routine/delete-routine/DeleteRoutineUseCaseImpl';

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
    {
      provide: ToggleActivationUseCase,
      useClass: ToggleActivationUseCaseImpl,
    },
    {
      provide: DeleteRoutineUseCase,
      useClass: DeleteRoutineUseCaseImpl,
    },
  ],
  exports: [],
})
export class RoutineModule {}
