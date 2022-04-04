import { Module } from '@nestjs/common';
import { ModifyUserUseCaseImpl } from '../domain/use-cases/user/modify-user/ModifyUserUseCaseImpl';
import { FindUserUseCaseImpl } from '../domain/use-cases/user/find-user/FindUserUseCaseImpl';
import { FindUserUseCase } from '../domain/use-cases/user/find-user/FindUserUseCase';
import { ModifyUserUseCase } from '../domain/use-cases/user/modify-user/ModifyUserUseCase';
import { UserControllerInjectedDecorator } from './controllers/user/UserControllerInjectedDecorator';
import { PatchAvatarUseCase } from '../domain/use-cases/user/patch-avatar/PatchAvatarUseCase';
import { PatchAvatarUseCaseImpl } from '../domain/use-cases/user/patch-avatar/PatchAvatarUseCaseImpl';
import { ValidateUsernameUseCase } from '../domain/use-cases/user/validate-username/ValidateUsernameUseCase';
import { ValidateUsernameUseCaseImpl } from '../domain/use-cases/user/validate-username/ValidateusernameUseCaseImpl';

@Module({
  imports: [],
  controllers: [UserControllerInjectedDecorator],
  providers: [
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
