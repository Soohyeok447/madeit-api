import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
// import { RegisterAdminResponseDto } from '../../domain/use-cases/admin/register-admin/dtos/RegisterAdminResponseDto';
// import { RegisterAdminRequestDto } from './register-admin/RegisterAdminRequestDto';
import { IssueAdminTokenResponseDto } from '../../domain/use-cases/admin/issue-admin-token/dtos/IssueAdminTokenResponseDto';
import { IssueAdminTokenUseCase } from '../../domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { RefreshAdminTokenResponseDto } from '../../domain/use-cases/admin/refresh-admin-token/dtos/RefreshAdminTokenResponseDto';
import { RefreshAdminTokenUseCase } from '../../domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RegisterAdminUseCase } from '../../domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { IssueAdminTokenRequestDto } from './issue-admin-token/IssueAdminTokenRequestDto';
import { getEnvironment } from '../../infrastructure/environment';
import { AddImageByAdminResponseDto } from '../../domain/use-cases/admin/add-image-by-admin/dtos/AddImageByAdminResponseDto';
import { AddImageByAdminUseCaseParams } from '../../domain/use-cases/admin/add-image-by-admin/dtos/AddImageByAdminUseCaseParams';
import { AddImageByAdminUseCase } from '../../domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';

@Injectable()
export class AdminController {
  public constructor(
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly issueAdminTokenUseCase: IssueAdminTokenUseCase,
    private readonly refreshAdminTokenUseCase: RefreshAdminTokenUseCase,
    private readonly addImageByAdminUseCase: AddImageByAdminUseCase,
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
      httpOnly: getEnvironment() !== 'test' ? true : false,
      secure: getEnvironment() !== 'test' ? true : false,
      sameSite: 'none',
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: getEnvironment() !== 'test' ? true : false,
      secure: getEnvironment() !== 'test' ? true : false,
      sameSite: 'none',
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
      httpOnly: getEnvironment() !== 'test' ? true : false,
      secure: getEnvironment() !== 'test' ? true : false,
      sameSite: 'none',
    });

    return {};
  }

  public async addImageByAdmin(
    req: Request,
    image: Express.Multer.File,
  ): Promise<AddImageByAdminResponseDto> {
    const input: AddImageByAdminUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      image,
      description: req.body['description'],
    };

    return await this.addImageByAdminUseCase.execute(input);
  }
}
