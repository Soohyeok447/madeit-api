import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { UserRepository } from 'src/domain/repositories/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from 'src/infrastructure/schemas/routine.schema';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';
import { ProductSchema } from 'src/infrastructure/schemas/product.schema';
import { RoutineRepository } from 'src/domain/repositories/routine.repsotiroy';
import { RoutineRepositoryImpl } from 'src/infrastructure/repositories/routine.repository';
import { RoutineController } from 'src/adapter/controllers/routine.controller';
import { RoutineService } from 'src/domain/services/interfaces/routine.service';
import { RoutineServiceImpl } from 'src/domain/services/routine.service';

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
      }
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
      provide: RoutineService,
      useClass: RoutineServiceImpl,
    }
  ],
  exports: [],
})
export class RoutineModule {}
