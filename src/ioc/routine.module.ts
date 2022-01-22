import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { UserRepository } from 'src/domain/common/repositories/user/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from 'src/infrastructure/schemas/routine.schema';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';
import { ProductSchema } from 'src/infrastructure/schemas/product.schema';
import { RoutineRepository } from 'src/domain/common/repositories/routine/routine.repsotiroy';
import { RoutineRepositoryImpl } from 'src/infrastructure/repositories/routine.repository';
import { RoutineController } from 'src/adapter/controllers/routine.controller';
import { RoutineService } from 'src/domain/routine/service/interface/routine.service';
import { RoutineServiceImpl } from 'src/domain/routine/service/routine.service';
import { ImageSchema } from 'src/infrastructure/schemas/image.schema';
import { ImageRepository } from 'src/domain/common/repositories/image/image.repository';
import { ImageRepositoryImpl } from 'src/infrastructure/repositories/image.repository';
import { ImageProvider } from 'src/domain/common/providers/image.provider';
import { ImageProviderImpl } from 'src/infrastructure/providers/image.provider';

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
