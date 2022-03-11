import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { ImageRepositoryImpl } from '../infrastructure/repositories/ImageRepositoryImpl';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';
import { ImageProvider } from '../domain/providers/ImageProvider';
import { ImageProviderImpl } from '../infrastructure/providers/ImageProviderImpl';
import { ImageRepository } from '../domain/repositories/image/ImageRepository';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { ModifyUserUseCaseImpl } from '../domain/use-cases/user/modify-user/ModifyUserUseCaseImpl';
import { FindUserUseCaseImpl } from '../domain/use-cases/user/find-user/FindUserUseCaseImpl';
import { FindUserUseCase } from '../domain/use-cases/user/find-user/FindUserUseCase';
import { ModifyUserUseCase } from '../domain/use-cases/user/modify-user/ModifyUserUseCase';
import { UserControllerInjectedDecorator } from './controllers/user/UserControllerInjectedDecorator';
import { PatchAvatarUseCase } from '../domain/use-cases/user/patch-avatar/PatchAvatarUseCase';
import { PatchAvatarUseCaseImpl } from '../domain/use-cases/user/patch-avatar/PatchAvatarUseCaseImpl';
import { ValidateUsernameUseCase } from '../domain/use-cases/user/validate-username/ValidateUsernameUseCase';
import { ValidateUsernameUseCaseImpl } from '../domain/use-cases/user/validate-username/ValidateusernameUseCaseImpl';
import { CommonUserService } from '../domain/use-cases/user/common/CommonUserService';

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
  controllers: [UserControllerInjectedDecorator],
  providers: [
    CommonUserService,
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
      provide: FindUserUseCase,
      useClass: FindUserUseCaseImpl,
    },
    {
      provide: ModifyUserUseCase,
      useClass: ModifyUserUseCaseImpl,
    },
    {
      provide: PatchAvatarUseCase,
      useClass: PatchAvatarUseCaseImpl,
    },
    {
      provide: ValidateUsernameUseCase,
      useClass: ValidateUsernameUseCaseImpl,
    },
  ],
  exports: [],
})
export class UserModule {}
