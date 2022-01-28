import { Module } from '@nestjs/common';
import { UserController } from '../adapter/controllers/UserController';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../infrastructure/schemas/UserSchema';
import { ImageRepositoryImpl } from '../infrastructure/repositories/ImageRepositoryImpl';
import { ImageSchema } from '../infrastructure/schemas/ImageSchema';
import { ImageProvider } from '../domain/providers/ImageProvider';
import { ImageProviderImpl } from '../infrastructure/providers/ImageProviderImpl';
import { ImageRepository } from '../domain/repositories/image/ImageRepository';
import { UserRepository } from '../domain/repositories/user/UserRepository';
import { DoUserOnboardingUseCaseImpl } from '../domain/use-cases/user/do-user-onboarding/DoUserOnboardingUseCaseImpl';
import { ModifyUserUseCaseImpl } from '../domain/use-cases/user/modify-user/ModifyUserUseCaseImpl';
import { FindUserUseCaseImpl } from '../domain/use-cases/user/find-user/FindUserUseCaseImpl';
import { FindUserUseCase } from '../domain/use-cases/user/find-user/FindUserUseCase';
import { ModifyUserUseCase } from '../domain/use-cases/user/modify-user/ModifyUserUseCase';
import { DoUseronboardingUseCase } from '../domain/use-cases/user/do-user-onboarding/DoUserOnboardingUseCase';
import { UserControllerInjectedDecorator } from './controllers/user/UserControllerInjectedDecorator';

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
      provide: DoUseronboardingUseCase,
      useClass: DoUserOnboardingUseCaseImpl,
    },
    {
      provide: FindUserUseCase,
      useClass: FindUserUseCaseImpl,
    },
    {
      provide: ModifyUserUseCase,
      useClass: ModifyUserUseCaseImpl,
    },
  ],
  exports: [

  ],
})
export class UserModule { }
