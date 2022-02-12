import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from '../infrastructure/schemas/RoutineSchema';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { UserRepository } from '../domain/repositories/user/UserRepository';

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
  controllers: [],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [],
})
export class OrderHistoryModule {}
