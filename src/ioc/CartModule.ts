import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from '../infrastructure/schemas/RoutineSchema';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { CartSchema } from '../infrastructure/schemas/CartSchema';
import { CartRepositoryImpl } from '../infrastructure/repositories/CartRepositoryImpl';
import { RoutineRepositoryImpl } from '../infrastructure/repositories/RoutineRepositoryImpl';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { CartRepository } from '../domain/repositories/cart/CartRepository';
import { RoutineRepository } from '../domain/repositories/routine/RoutineRepository';
import { CartControllerInjectedDecorator } from './controllers/cart/CartControllerInjectedDecorator';
import { GetCartsUseCase } from '../domain/use-cases/cart/get-carts/GetCartsUseCase';
import { GetCartsUseCaseImpl } from '../domain/use-cases/cart/get-carts/GetCartsUseCaseImpl';
import { DeleteRoutineFromCartUseCase } from '../domain/use-cases/cart/delete-routine-from-cart/DeleteRoutineFromCartUseCase';
import { DeleteRoutineFromCartUseCaseImpl } from '../domain/use-cases/cart/delete-routine-from-cart/DeleteRoutineFromCartUseCaseImpl';
import { AddRoutineToCartUseCase } from '../domain/use-cases/cart/add-routine-to-cart/AddRoutineToCartUseCase';
import { AddRoutineToCartUseCaseImpl } from '../domain/use-cases/cart/add-routine-to-cart/AddRoutineToCartUseCaseImpl';
import { RecommendedRoutineRepository } from '../domain/repositories/recommended-routine/RecommendedRoutineRepository';
import { RecommendedRoutineRepositoryImpl } from '../infrastructure/repositories/RecommendedRoutineRepositoryImpl';
import { RecommendedRoutineSchema } from '../infrastructure/schemas/RecommendedRoutineSchema';
import { ImageRepository } from '../domain/repositories/image/ImageRepository';
import { ImageRepositoryImpl } from '../infrastructure/repositories/ImageRepositoryImpl';
import { ImageProvider } from '../domain/providers/ImageProvider';
import { ImageProviderImpl } from '../infrastructure/providers/ImageProviderImpl';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';

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
        name: 'Recommended-Routine',
        schema: RecommendedRoutineSchema,
      },
      {
        name: 'Cart',
        schema: CartSchema,
      },
      {
        name: 'Image',
        schema: ImageSchema,
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
      provide: CartRepository,
      useClass: CartRepositoryImpl,
    },
    {
      provide: ImageRepository,
      useClass: ImageRepositoryImpl,
    },
    {
      provide: ImageProvider,
      useClass: ImageProviderImpl,
    },
    {
      provide: RecommendedRoutineRepository,
      useClass: RecommendedRoutineRepositoryImpl,
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
