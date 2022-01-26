import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { RoutineSchema } from 'src/infrastructure/schemas/RoutineSchema';
import { UserSchema } from 'src/infrastructure/schemas/UserSchema';
import { ProductSchema } from 'src/infrastructure/schemas/ProductSchema';
import { RoutineRepositoryImpl } from 'src/infrastructure/repositories/RoutineRepositoryImpl';
import { RoutineController } from 'src/adapter/controllers/RoutineController';
import { ImageRepositoryImpl } from 'src/infrastructure/repositories/ImageRepositoryImpl';

import { ImageProviderImpl } from 'src/infrastructure/providers/ImageProviderImpl';
import { ImageSchema } from 'src/infrastructure/schemas/ImageSchema';
import { RoutineRepository } from 'src/domain/repositories/routine/RoutineRepository';
import { UserRepository } from 'src/domain/repositories/user/UserRepository';
import { ImageRepository } from 'src/domain/repositories/image/ImageRepository';
import { ImageProvider } from 'src/domain/providers/ImageProvider';
import { RoutineService } from 'src/domain/use-cases/routine/service/interface/RoutineService';
import { RoutineServiceImpl } from 'src/domain/use-cases/routine/service/RoutineServiceImpl';

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
      },
      {
        name: 'Image',
        schema: ImageSchema,
      },
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
      provide: ImageRepository,
      useClass: ImageRepositoryImpl,
    },
    {
      provide: ImageProvider,
      useClass: ImageProviderImpl,
    },
    {
      provide: RoutineService,
      useClass: RoutineServiceImpl,
    },
  ],
  exports: [],
})
export class RoutineModule {}
