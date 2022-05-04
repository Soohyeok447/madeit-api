import { Injectable } from '@nestjs/common';
import { Admin } from '../../../entities/Admin';
import {
  AdminAuthProvider,
  Payload,
} from '../../../providers/AdminAuthProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { AdminNotFoundException } from '../common/exceptions/AdminNotFoundException';
import { RefreshAdminTokenResponseDto } from './dtos/RefreshAdminTokenResponseDto';
import { RefreshAdminTokenUseCaseParams } from './dtos/RefreshAdminTokenUseCaseParams';
import { InvalidRefreshAdminTokenException } from './exceptions/InvalidRefreshAdminTokenException';
import { RefreshAdminTokenUseCase } from './RefreshAdminTokenUseCase';

@Injectable()
export class RefreshAdminTokenUseCaseImpl implements RefreshAdminTokenUseCase {
  public constructor(
    private readonly _logger: LoggerProvider,
    private readonly _adminRepository: AdminRepository,
    private readonly _adminAuthProvider: AdminAuthProvider,
  ) {}

  public async execute({
    refreshToken,
  }: RefreshAdminTokenUseCaseParams): Promise<RefreshAdminTokenResponseDto> {
    this._logger.setContext('RefreshAdminToken');

    const payload: Payload = this._adminAuthProvider.verify(refreshToken);

    if (!payload)
      throw new InvalidRefreshAdminTokenException(
        this._logger.getContext(),
        `유효하지않은 어드민 재발급 토큰입니다.`,
      );

    const admin: Admin = await this._adminRepository.findOneByIndentifier(
      payload.id,
    );

    if (!admin)
      throw new AdminNotFoundException(
        this._logger.getContext(),
        `존재하지 않는 어드민`,
      );

    const accessToken: string = this._adminAuthProvider.issueAccessToken(
      payload.id,
    );

    return { accessToken };
  }
}
