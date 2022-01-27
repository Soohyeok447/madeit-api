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
import { UseCase } from '../domain/use-cases/UseCase';
import { DoUserOnboardingUseCase } from '../domain/use-cases/user/do-user-onboarding/DoUserOnboardingUseCase';
import { ModifyUserUseCase } from '../domain/use-cases/user/modify-user/ModifyUserUseCase';
import { FindUserUseCaseImpl } from '../domain/use-cases/user/find-user/FindUserUseCaseImpl';
import { FindUserUseCase } from '../domain/use-cases/user/find-user/FindUserUseCase';

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
      provide: UseCase,
      useClass: DoUserOnboardingUseCase,
    },
    {
      provide: FindUserUseCase,
      useClass: FindUserUseCaseImpl,
    },
    {
      provide: UseCase,
      useClass: ModifyUserUseCase,
    },
  ],
  exports: [

  ],
})
export class UserModule {}
