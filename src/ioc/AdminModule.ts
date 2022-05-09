import { Module } from '@nestjs/common';
import { CountUsersAddedOneRoutineUseCase } from '../domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { CountUsersUseCase } from '../domain/use-cases/admin/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../domain/use-cases/admin/count-users/CountUsersUseCaseImpl';
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
      provide: CountUsersUseCase,
      useClass: CountUsersUseCaseImpl,
    },
    {
      provide: CountUsersAddedOneRoutineUseCase,
      useClass: CountUsersAddedOneRoutineUseCaseImpl,
    },
  ],
  controllers: [AdminControllerInjectedDecorator],
})
export class AdminModule {}
