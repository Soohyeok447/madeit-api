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
import { DoUserOnboardingUseCaseImpl } from '../domain/use-cases/user/do-user-onboarding/DoUserOnboardingUseCaseImpl';
import { ModifyUserUseCaseImpl } from '../domain/use-cases/user/modify-user/ModifyUserUseCaseImpl';
import { FindUserUseCaseImpl } from '../domain/use-cases/user/find-user/FindUserUseCaseImpl';
import { FindUserUseCase } from '../domain/use-cases/user/find-user/FindUserUseCase';
import { ModifyUserUseCase } from '../domain/use-cases/user/modify-user/ModifyUserUseCase';
import { DoUseronboardingUseCase } from '../domain/use-cases/user/do-user-onboarding/DoUserOnboardingUseCase';
import { UserControllerInjectedDecorator } from './controllers/user/UserControllerInjectedDecorator';
import { PatchAvatarUseCase } from '../domain/use-cases/user/patch-avatar/PatchAvatarUseCase';
import { PatchAvatarUseCaseImpl } from '../domain/use-cases/user/patch-avatar/PatchAvatarUseCaseImpl';
import { UserCommonService } from 'src/domain/use-cases/user/service/UserCommonService';
import { UserCommonServiceImpl } from 'src/domain/use-cases/user/service/concrete/UserCommonServiceImpl';
import { RoutineRepository } from 'src/domain/repositories/routine/RoutineRepository';
import { RoutineRepositoryImpl } from 'src/infrastructure/repositories/RoutineRepositoryImpl';
import { RoutineSchema } from 'src/infrastructure/schemas/RoutineSchema';

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
      provide: UserCommonService,
      useClass: UserCommonServiceImpl,
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
    {
      provide: PatchAvatarUseCase,
      useClass: PatchAvatarUseCaseImpl,
    },
  ],
  exports: [],
})
export class UserModule { }
