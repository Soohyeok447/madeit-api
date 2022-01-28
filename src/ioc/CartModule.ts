import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from '../infrastructure/schemas/RoutineSchema';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { CartSchema } from '../infrastructure/schemas/CartSchema';
import { CartRepositoryImpl } from '../infrastructure/repositories/CartRepositoryImpl';
import { RoutineRepositoryImpl } from '../infrastructure/repositories/RoutineRepositoryImpl';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { CartService } from '../domain/use-cases/cart/service/interface/CartService';
import { CartServiceImpl } from '../domain/use-cases/cart/service/CartServiceImpl';
import { CartRepository } from '../domain/repositories/cart/CartRepository';
import { RoutineRepository } from '../domain/repositories/routine/RoutineRepository';
import { CartControllerInjectedDecorator } from './controllers/cart/CartControllerInjectedDecorator';
import { GetCartsUseCase } from '../domain/use-cases/cart/get-carts/GetCartsUseCase';
import { GetCartsUseCaseImpl } from '../domain/use-cases/cart/get-carts/GetCartsUseCaseImpl';
import { DeleteRoutineFromCartUseCase } from '../domain/use-cases/cart/delete-routine-from-cart/DeleteRoutineFromCartUseCase';
import { DeleteRoutineFromCartUseCaseImpl } from '../domain/use-cases/cart/delete-routine-from-cart/DeleteRoutineFromCartUseCaseImpl';
import { AddRoutineToCartUseCase } from '../domain/use-cases/cart/add-routine-to-cart/AddRoutineToCartUseCase';
import { AddRoutineToCartUseCaseImpl } from '../domain/use-cases/cart/add-routine-to-cart/AddRoutineToCartUseCaseImpl';

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
  controllers: [CartControllerInjectedDecorator],
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
    {
      provide: GetCartsUseCase,
      useClass: GetCartsUseCaseImpl,
    },
    {
      provide: DeleteRoutineFromCartUseCase,
      useClass: DeleteRoutineFromCartUseCaseImpl,
    },
    {
      provide: AddRoutineToCartUseCase,
      useClass: AddRoutineToCartUseCaseImpl,
    },
  ],
  exports: [],
})
export class CartModule {}
