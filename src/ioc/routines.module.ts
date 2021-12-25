import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { UserRepository } from 'src/domain/repositories/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from 'src/infrastructure/schemas/routine.schema';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';
import { ProductSchema } from 'src/infrastructure/schemas/product.schema';

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
  controllers: [],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [],
})
export class RoutineModule {}
