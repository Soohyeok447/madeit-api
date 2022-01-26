import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from 'src/infrastructure/schemas/RoutineSchema';
import { UserSchema } from 'src/infrastructure/schemas/UserSchema';
import { CartSchema } from 'src/infrastructure/schemas/CartSchema';
import { CartController } from 'src/adapter/controllers/CartController';
import { CartRepositoryImpl } from 'src/infrastructure/repositories/CartRepositoryImpl';

import { RoutineRepositoryImpl } from 'src/infrastructure/repositories/RoutineRepositoryImpl';
import { UserRepository } from 'src/domain/repositories/user/UserRepository';
import { CartService } from 'src/domain/use-cases/cart/service/interface/CartService';
import { CartServiceImpl } from 'src/domain/use-cases/cart/service/CartServiceImpl';
import { CartRepository } from 'src/domain/repositories/cart/CartRepository';
import { RoutineRepository } from 'src/domain/repositories/routine/RoutineRepository';

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
        schema: CartSchema,
      },
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
    },
  ],
  exports: [],
})
export class CartModule {}
