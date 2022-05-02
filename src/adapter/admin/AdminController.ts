import { Injectable } from '@nestjs/common';
import { IssueAdminTokenResponseDto } from '../../domain/use-cases/admin/issue-admin-token/dtos/IssueAdminTokenResponseDto';
import { IssueAdminTokenUseCase } from '../../domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { ModifyPasswordResponseDto } from '../../domain/use-cases/admin/modify-password/dtos/ModifyPasswordResponseDto';
import { ModifyPasswordUseCase } from '../../domain/use-cases/admin/modify-password/ModifyPasswordUseCase';
import { RefreshAdminTokenResponseDto } from '../../domain/use-cases/admin/refresh-admin-token/dtos/RefreshAdminTokenResponseDto';
import { RefreshAdminTokenUseCase } from '../../domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RegisterAdminResponseDto } from '../../domain/use-cases/admin/register-admin/dtos/RegisterAdminResponseDto';
import { RegisterAdminUseCase } from '../../domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { UserPayload } from '../common/decorators/user.decorator';
import { IssueAdminTokenRequestDto } from './issue-admin-token/IssueAdminTokenRequestDto';
import { ModifyPasswordRequestDto } from './modify-password/ModifyPasswordRequestDto';
import { RegisterAdminRequestDto } from './register-admin/RegisterAdminRequestDto';

@Injectable()
export class AdminController {
  public constructor(
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly modifyPasswordUseCase: ModifyPasswordUseCase,
    private readonly issueAdminTokenUseCase: IssueAdminTokenUseCase,
    private readonly refreshAdminTokenUseCase: RefreshAdminTokenUseCase,
  ) {}

  public async registerAdmin({
    id,
    password,
  }: RegisterAdminRequestDto): Promise<RegisterAdminResponseDto> {
    return this.registerAdminUseCase.execute({
      id,
      password,
    });
  }

  public async modifyPassword(
    user: UserPayload,
    { oldPassword, newPassword }: ModifyPasswordRequestDto,
  ): Promise<ModifyPasswordResponseDto> {
    return this.modifyPasswordUseCase.execute({
      id: user.id,
      oldPassword,
      newPassword,
    });
  }

  public async issueAdminToken({
    id,
    password,
  }: IssueAdminTokenRequestDto): Promise<IssueAdminTokenResponseDto> {
    return this.issueAdminTokenUseCase.execute({
      id,
      password,
    });
  }

  public async refreshAdminToken(
    user: UserPayload,
  ): Promise<RefreshAdminTokenResponseDto> {
    return this.refreshAdminTokenUseCase.execute({
      id: user.id,
    });
  }
}
