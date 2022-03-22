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
import { UserUtils } from '../domain/use-cases/user/common/UserUtils';
import { MomentProvider } from '../domain/providers/MomentProvider';
import { MomentProviderImpl } from '../infrastructure/providers/MomentProviderImpl';
import { DeleteRoutineUseCase } from '../domain/use-cases/routine/delete-routine/DeleteRoutineUseCase';
import { DeleteRoutineUseCaseImpl } from '../domain/use-cases/routine/delete-routine/DeleteRoutineUseCaseImpl';
import { ActivateRoutineUseCase } from '../domain/use-cases/routine/activate-routine/ActivateRoutineUseCase';
import { ActivateRoutineUseCaseImpl } from '../domain/use-cases/routine/activate-routine/ActivateRoutineUseCaseImpl';
import { InactivateRoutineUseCase } from '../domain/use-cases/routine/inactivate-routine/InactivateRoutineUseCase';
import { InactivateRoutineUseCaseImpl } from '../domain/use-cases/routine/inactivate-routine/InactivateRoutineUseCaseImpl';
import { DoneRoutineUseCase } from '../domain/use-cases/routine/done-routine/DoneRoutineUseCase';
import { DoneRoutineUseCaseImpl } from '../domain/use-cases/routine/done-routine/DoneRoutineUseCaseImpl';
import { RecommendedRoutineRepository } from '../domain/repositories/recommended-routine/RecommendedRoutineRepository';
import { RecommendedRoutineRepositoryImpl } from '../infrastructure/repositories/RecommendedRoutineRepositoryImpl';
import { RecommendedRoutineSchema } from '../infrastructure/schemas/RecommendedRoutineSchema';

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
        name: 'Routine',
        schema: RoutineSchema,
      },
    ]),
  ],
  controllers: [RoutineControllerInjectedDecorator],
  providers: [
    UserUtils,
    {
      provide: RoutineRepository,
      useClass: RoutineRepositoryImpl,
    },
    {
      provide: RecommendedRoutineRepository,
      useClass: RecommendedRoutineRepositoryImpl,
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
      provide: ActivateRoutineUseCase,
      useClass: ActivateRoutineUseCaseImpl,
    },
    {
      provide: InactivateRoutineUseCase,
      useClass: InactivateRoutineUseCaseImpl,
    },
    {
      provide: DeleteRoutineUseCase,
      useClass: DeleteRoutineUseCaseImpl,
    },
    {
      provide: DoneRoutineUseCase,
      useClass: DoneRoutineUseCaseImpl,
    },
  ],
  exports: [],
})
export class RoutineModule {}
