import { Module } from '@nestjs/common';
import { AddRoutineUseCaseImpl } from '../domain/use-cases/routine/add-routine/AddRoutineUseCaseImpl';
import { GetRoutineDetailUseCaseImpl } from '../domain/use-cases/routine/get-routine/GetRoutineUseCaseImpl';
import { GetAllRoutinesUseCaseImpl } from '../domain/use-cases/routine/get-routines/GetRoutinesUseCaseImpl';
import { ModifyRoutineUseCaseImpl } from '../domain/use-cases/routine/modify-routine/ModifyRoutineUseCaseImpl';
import { RoutineControllerInjectedDecorator } from './controllers/routine/RoutineControllerInjectedDecorator';
import { GetRoutineUseCase } from '../domain/use-cases/routine/get-routine/GetRoutineUseCase';
import { GetRoutinesUseCase } from '../domain/use-cases/routine/get-routines/GetRoutinesUseCase';
import { ModifyRoutineUseCase } from '../domain/use-cases/routine/modify-routine/ModifyRoutineUseCase';
import { AddRoutineUseCase } from '../domain/use-cases/routine/add-routine/AddRoutineUseCase';
import { DeleteRoutineUseCase } from '../domain/use-cases/routine/delete-routine/DeleteRoutineUseCase';
import { DeleteRoutineUseCaseImpl } from '../domain/use-cases/routine/delete-routine/DeleteRoutineUseCaseImpl';
import { ActivateRoutineUseCase } from '../domain/use-cases/routine/activate-routine/ActivateRoutineUseCase';
import { ActivateRoutineUseCaseImpl } from '../domain/use-cases/routine/activate-routine/ActivateRoutineUseCaseImpl';
import { InactivateRoutineUseCase } from '../domain/use-cases/routine/inactivate-routine/InactivateRoutineUseCase';
import { InactivateRoutineUseCaseImpl } from '../domain/use-cases/routine/inactivate-routine/InactivateRoutineUseCaseImpl';
import { DoneRoutineUseCase } from '../domain/use-cases/routine/done-routine/DoneRoutineUseCase';
import { DoneRoutineUseCaseImpl } from '../domain/use-cases/routine/done-routine/DoneRoutineUseCaseImpl';

@Module({
  imports: [],
  controllers: [RoutineControllerInjectedDecorator],
  providers: [
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
