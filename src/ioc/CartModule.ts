import { Module } from '@nestjs/common';
import { CartControllerInjectedDecorator } from './controllers/cart/CartControllerInjectedDecorator';
import { GetCartsUseCase } from '../domain/use-cases/cart/get-carts/GetCartsUseCase';
import { GetCartsUseCaseImpl } from '../domain/use-cases/cart/get-carts/GetCartsUseCaseImpl';
import { DeleteRoutineFromCartUseCase } from '../domain/use-cases/cart/delete-routine-from-cart/DeleteRoutineFromCartUseCase';
import { DeleteRoutineFromCartUseCaseImpl } from '../domain/use-cases/cart/delete-routine-from-cart/DeleteRoutineFromCartUseCaseImpl';
import { AddRoutineToCartUseCase } from '../domain/use-cases/cart/add-routine-to-cart/AddRoutineToCartUseCase';
import { AddRoutineToCartUseCaseImpl } from '../domain/use-cases/cart/add-routine-to-cart/AddRoutineToCartUseCaseImpl';

@Module({
  imports: [],
  controllers: [CartControllerInjectedDecorator],
  providers: [
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
