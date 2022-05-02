import { Injectable } from '@nestjs/common';
import { Admin } from '../../../entities/Admin';
import { AdminAuthProvider } from '../../../providers/AdminAuthProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { AdminNotFoundException } from '../common/exceptions/AdminNotFoundException';
import { RefreshAdminTokenResponseDto } from './dtos/RefreshAdminTokenResponseDto';
import { RefreshAdminTokenUseCaseParams } from './dtos/RefreshAdminTokenUseCaseParams';
import { RefreshAdminTokenUseCase } from './RefreshAdminTokenUseCase';

@Injectable()
export class RefreshAdminTokenUseCaseImpl implements RefreshAdminTokenUseCase {
  public constructor(
    private readonly _logger: LoggerProvider,
    private readonly _adminRepository: AdminRepository,
    private readonly _adminAuthProvider: AdminAuthProvider,
  ) {}

  public async execute({
    id,
  }: RefreshAdminTokenUseCaseParams): Promise<RefreshAdminTokenResponseDto> {
    this._logger.setContext('RefreshAdminToken');

    const admin: Admin = await this._adminRepository.findOneByIndentifier(id);

    if (!admin)
      throw new AdminNotFoundException(
        this._logger.getContext(),
        `존재하지 않는 어드민`,
      );

    const accessToken: string = this._adminAuthProvider.issueAccessToken(id);

    return { accessToken };
  }
}
