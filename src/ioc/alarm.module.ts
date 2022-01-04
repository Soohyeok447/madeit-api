import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { UserRepository } from 'src/domain/repositories/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from 'src/infrastructure/schemas/routine.schema';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';
import { AlarmService } from 'src/domain/services/interfaces/alarm.service';
import { AlarmController } from 'src/adapter/controllers/alarm.controller';
import { AlarmServiceImpl } from 'src/domain/services/alarm.service';
import { AlarmSchema } from 'src/infrastructure/schemas/alarm.schema';
import { AlarmRepository } from 'src/domain/repositories/alarm.repository';
import { AlarmRepositoryImpl } from 'src/infrastructure/repositories/alarm.repository';
import { RoutineRepositoryImpl } from 'src/infrastructure/repositories/routine.repository';
import { RoutineRepository } from 'src/domain/repositories/routine.repsotiroy';

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
  controllers: [AlarmController],
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
