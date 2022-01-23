import { Module } from '@nestjs/common';
import { UsersController } from '../adapter/controllers/users.controller';
import { UserRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { UsersServiceImpl } from 'src/domain/users/service/users.service';
import { UserRepository } from 'src/domain/__common__/repositories/user/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';
import { UsersService } from 'src/domain/users/service/interface/users.service';
import { ImageRepository } from 'src/domain/__common__/repositories/image/image.repository';
import { ImageRepositoryImpl } from 'src/infrastructure/repositories/image.repository';
import { ImageSchema } from 'src/infrastructure/schemas/image.schema';
import { ImageProvider } from 'src/domain/__common__/providers/image.provider';
import { ImageProviderImpl } from 'src/infrastructure/providers/image.provider';

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
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useClass: UsersServiceImpl,
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
      provide: UsersService,
      useClass: UsersServiceImpl,
    },
  ],
})
export class UserModule {}
