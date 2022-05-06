import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { CountActiveUsersResponseDto } from '../../domain/use-cases/admin/count-active-users/dtos/CountActiveUsersResponseDto';
import { CountActiveUsersUseCase } from '../../domain/use-cases/admin/count-active-users/CountActiveUsersUseCase';
// import { RegisterAdminResponseDto } from '../../domain/use-cases/admin/register-admin/dtos/RegisterAdminResponseDto';
// import { RegisterAdminRequestDto } from './register-admin/RegisterAdminRequestDto';
import { IssueAdminTokenResponseDto } from '../../domain/use-cases/admin/issue-admin-token/dtos/IssueAdminTokenResponseDto';
import { IssueAdminTokenUseCase } from '../../domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { RefreshAdminTokenResponseDto } from '../../domain/use-cases/admin/refresh-admin-token/dtos/RefreshAdminTokenResponseDto';
import { RefreshAdminTokenUseCase } from '../../domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RegisterAdminUseCase } from '../../domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { getEnvironment } from '../../infrastructure/environment';
import { IssueAdminTokenRequestDto } from './issue-admin-token/IssueAdminTokenRequestDto';

@Injectable()
export class AdminController {
  public constructor(
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly issueAdminTokenUseCase: IssueAdminTokenUseCase,
    private readonly refreshAdminTokenUseCase: RefreshAdminTokenUseCase,
    private readonly countActiveUsersUseCase: CountActiveUsersUseCase,
  ) {}

  // public async registerAdmin({
  //   id,
  //   password,
  // }: RegisterAdminRequestDto): Promise<RegisterAdminResponseDto> {
  //   return this.registerAdminUseCase.execute({
  //     id,
  //     password,
  //   });
  // }

  public async issueAdminToken(
    { id, password }: IssueAdminTokenRequestDto,
    res: Response,
  ): Promise<Record<string, never>> {
    const result: IssueAdminTokenResponseDto =
      await this.issueAdminTokenUseCase.execute({ id, password });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: getEnvironment() === 'prod' ? true : false,
      expires: result.accessToken['exp'],
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: getEnvironment() === 'prod' ? true : false,
      expires: result.accessToken['exp'],
    });

    return {};
  }

  public async refreshAdminToken(
    res: Response,
    req: Request,
  ): Promise<Record<string, never>> {
    const result: RefreshAdminTokenResponseDto =
      await this.refreshAdminTokenUseCase.execute({
        refreshToken: req.cookies['refreshToken'],
      });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: getEnvironment() === 'prod' ? true : false,
      expires: result.accessToken['exp'],
    });

    res.cookie('refreshToken', req.cookies['refreshToken'], {
      httpOnly: true,
      secure: getEnvironment() === 'prod' ? true : false,
      expires: req.cookies['refreshToken']['exp'],
    });

    return {};
  }

  public async countActiveUsers(
    req: Request,
  ): Promise<CountActiveUsersResponseDto> {
    return await this.countActiveUsersUseCase.execute({
      accessToken: req.cookies['accessToken'],
    });
  }
}
