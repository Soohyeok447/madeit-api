import { Module } from '@nestjs/common';
import { FindUserUseCase } from '../domain/use-cases/user/find-user/FindUserUseCase';
import { ModifyUserUseCase } from '../domain/use-cases/user/modify-user/ModifyUserUseCase';
import { UserControllerInjectedDecorator } from './controllers/user/UserControllerInjectedDecorator';
import { PatchAvatarUseCase } from '../domain/use-cases/user/patch-avatar/PatchAvatarUseCase';
import { ValidateUsernameUseCase } from '../domain/use-cases/user/validate-username/ValidateUsernameUseCase';
import { ValidateUsernameUseCaseImpl } from '../domain/use-cases/user/validate-username/ValidateusernameUseCaseImpl';
import { PatchAvatarUseCaseImplV2 } from '../domain/use-cases/user/patch-avatar/PatchAvatarUseCaseImplV2';
import { FindUserUseCaseImplV2 } from '../domain/use-cases/user/find-user/FindUserUseCaseImplV2';
import { ModifyUserUseCaseImplV2 } from '../domain/use-cases/user/modify-user/ModifyUserUseCaseImplV2';

@Module({
  imports: [],
  controllers: [UserControllerInjectedDecorator],
  providers: [
    {
      provide: FindUserUseCase,
      useClass: FindUserUseCaseImplV2,
    },
    {
      provide: ModifyUserUseCase,
      useClass: ModifyUserUseCaseImplV2,
    },
    {
      provide: PatchAvatarUseCase,
      useClass: PatchAvatarUseCaseImplV2,
    },
    {
      provide: ValidateUsernameUseCase,
      useClass: ValidateUsernameUseCaseImpl,
    },
  ],
  exports: [],
})
export class UserModule {}
