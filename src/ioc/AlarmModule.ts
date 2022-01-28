import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from 'src/infrastructure/schemas/RoutineSchema';
import { UserSchema } from 'src/infrastructure/schemas/UserSchema';
import { AlarmController } from 'src/adapter/controllers/AlarmController';
import { AlarmRepositoryImpl } from 'src/infrastructure/repositories/AlarmRepositoryImpl';
import { RoutineRepositoryImpl } from 'src/infrastructure/repositories/RoutineRepositoryImpl';
import { AlarmSchema } from 'src/infrastructure/schemas/alarmSchema';
import { UserRepository } from 'src/domain/repositories/user/UserRepository';
import { AlarmRepository } from 'src/domain/repositories/alarm/AlarmRepository';
import { AlarmService } from 'src/domain/use-cases/alarm/service/interface/AlarmService';
import { AlarmServiceImpl } from 'src/domain/use-cases/alarm/service/AlarmServiceImpl';
import { RoutineRepository } from 'src/domain/repositories/routine/RoutineRepository';
import { AlarmControllerInjectedDecorator } from './controllers/alarm/AlarmControllerInjectedDecorator';

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
    {
      provide: AlarmService,
      useClass: AlarmServiceImpl,
    },
    {
      provide: RoutineRepository,
      useClass: RoutineRepositoryImpl,
    },
  ],
  exports: [],
})
export class AlarmModule {}
