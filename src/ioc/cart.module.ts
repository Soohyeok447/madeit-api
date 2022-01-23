import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { UserRepository } from 'src/domain/__common__/repositories/user/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from 'src/infrastructure/schemas/routine.schema';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';
import { CartService } from 'src/domain/cart/service/interface/cart.service';
import { CartServiceImpl } from 'src/domain/cart/service/cart.service';
import { CartController } from 'src/adapter/controllers/cart.controller';
import { CartSchema } from 'src/infrastructure/schemas/cart.schema';
import { CartRepository } from 'src/domain/__common__/repositories/cart/cart.repository';
import { CartRepositoryImpl } from 'src/infrastructure/repositories/cart.repository';
import { RoutineRepository } from 'src/domain/__common__/repositories/routine/routine.repsotiroy';
import { RoutineRepositoryImpl } from 'src/infrastructure/repositories/routine.repository';

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
        name: 'Cart',
        schema: CartSchema
      }
    ]),
  ],
  controllers: [CartController],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: CartService,
      useClass: CartServiceImpl,
    },
    {
      provide: CartRepository,
      useClass: CartRepositoryImpl,
    },
    {
      provide: RoutineRepository,
      useClass: RoutineRepositoryImpl,
    }
  ],
  exports: [],
})
export class CartModule {}
