import { Module } from '@nestjs/common';
import { UserController } from '../adapter/controllers/UserController';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { UserServiceImpl } from '../domain/use-cases/user/service/UserServiceImpl';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { UserService } from '../domain/use-cases/user/service/interface/UserService';
import { ImageRepositoryImpl } from '../infrastructure/repositories/ImageRepositoryImpl';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';
import { ImageProvider } from 'src/domain/providers/ImageProvider';
import { ImageProviderImpl } from 'src/infrastructure/providers/ImageProviderImpl';
import { ImageRepository } from 'src/domain/repositories/image/ImageRepository';
import { UserRepository } from 'src/domain/repositories/user/UserRepository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Image',
        schema: ImageSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserService,
      useClass: UserServiceImpl,
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
  ],
  exports: [
    {
      provide: UserService,
      useClass: UserServiceImpl,
    },
  ],
})
export class UserModule {}
