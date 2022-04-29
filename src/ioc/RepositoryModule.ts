import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartRepository } from '../domain/repositories/cart/CartRepository';
import { ExchangeOrderRepository } from '../domain/repositories/exchange-order/ExchangeOrderRepository';
import { ExchangeTokenRepository } from '../domain/repositories/exchange-token/ExchangeTokenRepository';
import { ImageRepository } from '../domain/repositories/image/ImageRepository';
import { InformationBoardRepository } from '../domain/repositories/information-board/InformationBoardRepository';
import { RecommendedRoutineRepository } from '../domain/repositories/recommended-routine/RecommendedRoutineRepository';
import { RoutineRepository } from '../domain/repositories/routine/RoutineRepository';
import { SerialRepository } from '../domain/repositories/serial/SerialRepository';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { CartRepositoryImpl } from '../infrastructure/repositories/CartRepositoryImpl';
import { ExchangeOrderRepositoryImpl } from '../infrastructure/repositories/ExchangeOrderRepositoryImpl';
import { ExchangeTokenRepositoryImpl } from '../infrastructure/repositories/ExchangeTokenRepositoryImpl';
import { ImageRepositoryImpl } from '../infrastructure/repositories/ImageRepositoryImpl';
import { InformationBoardRepositoryImpl } from '../infrastructure/repositories/InformationBoardRepositoryImpl';
import { RecommendedRoutineRepositoryImpl } from '../infrastructure/repositories/RecommendedRoutineRepositoryImpl';
import { RoutineRepositoryImpl } from '../infrastructure/repositories/RoutineRepositoryImpl';
import { SerialRepositoryImpl } from '../infrastructure/repositories/SerialRepositoryImpl';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { CartSchema } from '../infrastructure/schemas/CartSchema';
import { ExchangeOrderSchema } from '../infrastructure/schemas/ExchangeOrderSchema';
import { ExchangeTokenSchema } from '../infrastructure/schemas/ExchangeTokenSchema';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';
import { InformationBoardSchema } from '../infrastructure/schemas/InformationBoardSchema';
import { RecommendedRoutineSchema } from '../infrastructure/schemas/RecommendedRoutineSchema';
import { RoutineSchema } from '../infrastructure/schemas/RoutineSchema';
import { SerialSchema } from '../infrastructure/schemas/SerialSchema';
import { UserSchema } from '../infrastructure/schemas/UserSchema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Recommended-Routine',
        schema: RecommendedRoutineSchema,
      },
      {
        name: 'Routine',
        schema: RoutineSchema,
      },
      {
        name: 'Cart',
        schema: CartSchema,
      },
      {
        name: 'Image',
        schema: ImageSchema,
      },
      {
        name: 'Information-Board',
        schema: InformationBoardSchema,
      },
      {
        name: 'Serial',
        schema: SerialSchema,
      },
      {
        name: 'Exchange-Token',
        schema: ExchangeTokenSchema,
      },
      {
        name: 'Exchange-Order',
        schema: ExchangeOrderSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: RoutineRepository,
      useClass: RoutineRepositoryImpl,
    },
    {
      provide: RecommendedRoutineRepository,
      useClass: RecommendedRoutineRepositoryImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: InformationBoardRepository,
      useClass: InformationBoardRepositoryImpl,
    },
    {
      provide: ImageRepository,
      useClass: ImageRepositoryImpl,
    },
    {
      provide: CartRepository,
      useClass: CartRepositoryImpl,
    },
    {
      provide: SerialRepository,
      useClass: SerialRepositoryImpl,
    },
    {
      provide: ExchangeTokenRepository,
      useClass: ExchangeTokenRepositoryImpl,
    },
    {
      provide: ExchangeOrderRepository,
      useClass: ExchangeOrderRepositoryImpl,
    },
  ],
  exports: [
    {
      provide: RoutineRepository,
      useClass: RoutineRepositoryImpl,
    },
    {
      provide: RecommendedRoutineRepository,
      useClass: RecommendedRoutineRepositoryImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: InformationBoardRepository,
      useClass: InformationBoardRepositoryImpl,
    },
    {
      provide: ImageRepository,
      useClass: ImageRepositoryImpl,
    },
    {
      provide: CartRepository,
      useClass: CartRepositoryImpl,
    },
    {
      provide: SerialRepository,
      useClass: SerialRepositoryImpl,
    },
    {
      provide: ExchangeTokenRepository,
      useClass: ExchangeTokenRepositoryImpl,
    },
    {
      provide: ExchangeOrderRepository,
      useClass: ExchangeOrderRepositoryImpl,
    },
  ],
})
export class RepositoryModule {}
