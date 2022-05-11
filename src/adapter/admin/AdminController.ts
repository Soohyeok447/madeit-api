import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { CountUsersResponseDto } from '../../domain/use-cases/admin/count-users/dtos/CountUsersResponseDto';
import { CountUsersUseCase } from '../../domain/use-cases/admin/count-users/CountUsersUseCase';
// import { RegisterAdminResponseDto } from '../../domain/use-cases/admin/register-admin/dtos/RegisterAdminResponseDto';
// import { RegisterAdminRequestDto } from './register-admin/RegisterAdminRequestDto';
import { IssueAdminTokenResponseDto } from '../../domain/use-cases/admin/issue-admin-token/dtos/IssueAdminTokenResponseDto';
import { IssueAdminTokenUseCase } from '../../domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { RefreshAdminTokenResponseDto } from '../../domain/use-cases/admin/refresh-admin-token/dtos/RefreshAdminTokenResponseDto';
import { RefreshAdminTokenUseCase } from '../../domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RegisterAdminUseCase } from '../../domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { getEnvironment } from '../../infrastructure/environment';
import { IssueAdminTokenRequestDto } from './issue-admin-token/IssueAdminTokenRequestDto';
import { CountUsersAddedOneRoutineResponseDto } from '../../domain/use-cases/admin/count-users-added-one-routine/dtos/CountUsersAddedOneRoutineResponseDto';
import { CountUsersAddedOneRoutineUseCase } from '../../domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';

@Injectable()
export class AdminController {
  public constructor(
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly issueAdminTokenUseCase: IssueAdminTokenUseCase,
    private readonly refreshAdminTokenUseCase: RefreshAdminTokenUseCase,
    private readonly countActiveUsersUseCase: CountUsersUseCase,
    private readonly countUsersAddedOneRoutineUseCase: CountUsersAddedOneRoutineUseCase,
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
      // expires: result.accessToken['exp'],
      // sameSite: 'none',
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: getEnvironment() === 'prod' ? true : false,
      // expires: result.accessToken['exp'],
      // sameSite: 'none',
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
      sameSite: 'none',
    });

    res.cookie('refreshToken', req.cookies['refreshToken'], {
      httpOnly: true,
      secure: getEnvironment() === 'prod' ? true : false,
      expires: req.cookies['refreshToken']['exp'],
      sameSite: 'none',
    });

    return {};
  }

  public async countUsers(req: Request): Promise<CountUsersResponseDto> {
    return await this.countActiveUsersUseCase.execute({
      accessToken: req.cookies['accessToken'],
    });
  }

  public async countUsersAddedOneRoutine(
    req: Request,
  ): Promise<CountUsersAddedOneRoutineResponseDto> {
    return await this.countUsersAddedOneRoutineUseCase.execute({
      accessToken: req.cookies['accessToken'],
    });
  }
}
