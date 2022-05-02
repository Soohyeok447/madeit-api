import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../../../common/exceptions/UnauthorizedException';
import { Admin } from '../../../entities/Admin';
import { AdminAuthProvider } from '../../../providers/AdminAuthProvider';
import { HashProvider } from '../../../providers/HashProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { AdminNotFoundException } from '../common/exceptions/AdminNotFoundException';
import { IssueAdminTokenResponseDto } from './dtos/IssueAdminTokenResponseDto';
import { IssueAdminTokenUseCaseParams } from './dtos/IssueAdminTokenUseCaseParams';
import { IssueAdminTokenUseCase } from './IssueAdminTokenUseCase';

@Injectable()
export class IssueAdminTokenUseCaseImpl implements IssueAdminTokenUseCase {
  public constructor(
    private readonly _logger: LoggerProvider,
    private readonly _adminRepository: AdminRepository,
    private readonly _adminAuthProvider: AdminAuthProvider,
    private readonly _hashProvider: HashProvider,
  ) {}

  public async execute({
    id,
    password,
  }: IssueAdminTokenUseCaseParams): Promise<IssueAdminTokenResponseDto> {
    this._logger.setContext('IssueAdminToken');

    const admin: Admin = await this._adminRepository.findOneByIndentifier(id);

    if (!admin)
      throw new AdminNotFoundException(
        this._logger.getContext(),
        `존재하지 않는 어드민`,
      );

    const isVerified: boolean = await this._hashProvider.compare(
      password,
      admin.password,
    );

    if (!isVerified)
      throw new UnauthorizedException(
        '어드민 인증 실패',
        87,
        this._logger.getContext(),
        `어드민 인증 실패`,
      );

    const accessToken: string = this._adminAuthProvider.issueAccessToken(id);
    const refreshToken: string = this._adminAuthProvider.issueRefreshToken(id);

    return { accessToken, refreshToken };
  }
}
