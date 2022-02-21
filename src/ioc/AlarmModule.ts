import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from '../infrastructure/schemas/RoutineSchema';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { AlarmRepositoryImpl } from '../infrastructure/repositories/AlarmRepositoryImpl';
import { RoutineRepositoryImpl } from '../infrastructure/repositories/RoutineRepositoryImpl';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { AlarmRepository } from '../domain/repositories/alarm/AlarmRepository';
import { CommonAlarmService } from '../domain/use-cases/alarm/service/CommonAlarmService';
import { RoutineRepository } from '../domain/repositories/routine/RoutineRepository';
import { AlarmControllerInjectedDecorator } from './controllers/alarm/AlarmControllerInjectedDecorator';
import { AddAlarmUseCase } from '../domain/use-cases/alarm/add-alarm/AddAlarmUseCase';
import { AddAlarmUseCaseImpl } from '../domain/use-cases/alarm/add-alarm/AddAlarmUseCaseImpl';
import { UpdateAlarmUseCase } from '../domain/use-cases/alarm/update-alarm/UpdateAlarmUseCase';
import { UpdateAlarmUseCaseImpl } from '../domain/use-cases/alarm/update-alarm/UpdateAlarmUseCaseImpl';
import { DeleteAlarmUseCase } from '../domain/use-cases/alarm/delete-alarm/DeleteAlarmUseCase';
import { DeleteAlarmUseCaseImpl } from '../domain/use-cases/alarm/delete-alarm/DeleteAlarmUseCaseImpl';
import { GetAlarmUseCase } from '../domain/use-cases/alarm/get-alarm/GetAlarmUseCase';
import { GetAlarmUseCaseImpl } from '../domain/use-cases/alarm/get-alarm/GetAlarmUseCaseImpl';
import { GetAllAlarmsUseCase } from '../domain/use-cases/alarm/get-all-alarms/GetAllAlarmsUseCase';
import { GetAllAlarmsUseCaseImpl } from '../domain/use-cases/alarm/get-all-alarms/GetAllAlarmsUseCaseImpl';
import { AlarmSchema } from '../infrastructure/schemas/AlarmSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Alarm',
        schema: AlarmSchema,
      },
      {
        name: 'Routine',
        schema: RoutineSchema,
      },
    ]),
  ],
  controllers: [AlarmControllerInjectedDecorator],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: AlarmRepository,
      useClass: AlarmRepositoryImpl,
    },
    // {
    //   provide: AlarmCommonService,
    //   useClass: AlarmCommonService,
    // },
    {
      provide: RoutineRepository,
      useClass: RoutineRepositoryImpl,
    },
    {
      provide: AddAlarmUseCase,
      useClass: AddAlarmUseCaseImpl,
    },
    {
      provide: UpdateAlarmUseCase,
      useClass: UpdateAlarmUseCaseImpl,
    },
    {
      provide: DeleteAlarmUseCase,
      useClass: DeleteAlarmUseCaseImpl,
    },
    {
      provide: GetAlarmUseCase,
      useClass: GetAlarmUseCaseImpl,
    },
    {
      provide: GetAllAlarmsUseCase,
      useClass: GetAllAlarmsUseCaseImpl,
    },
  ],
  exports: [],
})
export class AlarmModule {}
