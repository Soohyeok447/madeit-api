import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { UserRepository } from 'src/domain/repositories/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from 'src/infrastructure/schemas/routine.schema';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';
import { CartService } from 'src/domain/services/interfaces/cart.service';
import { CartServiceImpl } from 'src/domain/services/cart.service';
import { CartController } from 'src/adapter/controllers/cart.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name:'Routine',
        schema: RoutineSchema,
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
    }
  ],
  exports: [],
})
export class CartModule {}
