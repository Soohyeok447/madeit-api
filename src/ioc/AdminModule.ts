import { Module } from '@nestjs/common';
import { IssueAdminTokenUseCase } from '../domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { ModifyPasswordUseCase } from '../domain/use-cases/admin/modify-password/ModifyPasswordUseCase';
import { ModifyPasswordUseCaseImpl } from '../domain/use-cases/admin/modify-password/ModifyPasswordUseCaseImpl';
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
      provide: ModifyPasswordUseCase,
      useClass: ModifyPasswordUseCaseImpl,
    },
    {
      provide: IssueAdminTokenUseCase,
      useClass: IssueAdminTokenUseCaseImpl,
    },
    {
      provide: RefreshAdminTokenUseCase,
      useClass: RefreshAdminTokenUseCaseImpl,
    },
  ],
  controllers: [AdminControllerInjectedDecorator],
})
export class AdminModule {}
