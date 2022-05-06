import { Module } from '@nestjs/common';
import { CountActiveUsersUseCase } from '../domain/use-cases/admin/count-active-users/CountActiveUsersUseCase';
import { CountActiveUsersUseCaseImpl } from '../domain/use-cases/admin/count-active-users/CountActiveUsersUseCaseImpl';
import { IssueAdminTokenUseCase } from '../domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { RefreshAdminTokenUseCase } from '../domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RefreshAdminTokenUseCaseImpl } from '../domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCaseImpl';
import { RegisterAdminUseCase } from '../domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { RegisterAdminUseCaseImpl } from '../domain/use-cases/admin/register-admin/RegisterAdminUseCaseImpl';
import { AdminControllerInjectedDecorator } from './controllers/admin/AdminControllerInjectedDecorator';

@Module({
  providers: [
    {
      provide: RegisterAdminUseCase,
      useClass: RegisterAdminUseCaseImpl,
    },
    {
      provide: IssueAdminTokenUseCase,
      useClass: IssueAdminTokenUseCaseImpl,
    },
    {
      provide: RefreshAdminTokenUseCase,
      useClass: RefreshAdminTokenUseCaseImpl,
    },
    {
      provide: CountActiveUsersUseCase,
      useClass: CountActiveUsersUseCaseImpl,
    },
  ],
  controllers: [AdminControllerInjectedDecorator],
})
export class AdminModule {}
