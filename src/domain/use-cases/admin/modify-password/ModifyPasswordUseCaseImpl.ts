import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../../../common/exceptions/UnauthorizedException';
import { Admin } from '../../../entities/Admin';
import { HashProvider } from '../../../providers/HashProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { AdminNotFoundException } from '../common/exceptions/AdminNotFoundException';
import { ModifyPasswordResponseDto } from './dtos/ModifyPasswordResponseDto';
import { ModifyPasswordUseCaseParams } from './dtos/ModifyPasswordUseCaseParams';
import { ModifyPasswordUseCase } from './ModifyPasswordUseCase';

@Injectable()
export class ModifyPasswordUseCaseImpl implements ModifyPasswordUseCase {
  public constructor(
    private readonly _adminRepository: AdminRepository,
    private readonly _hashProvider: HashProvider,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    id,
    oldPassword,
    newPassword,
  }: ModifyPasswordUseCaseParams): Promise<ModifyPasswordResponseDto> {
    this._logger.setContext('modifyPassowrd');

    const admin: Admin = await this._adminRepository.findOneByIndentifier(id);

    if (!admin)
      throw new AdminNotFoundException(
        this._logger.getContext(),
        `존재하지 않는 어드민`,
      );

    const isVerified: boolean = await this._hashProvider.compare(
      oldPassword,
      admin.password,
    );

    if (!isVerified)
      throw new UnauthorizedException(
        '어드민 인증 실패',
        87,
        this._logger.getContext(),
        `어드민 인증 실패`,
      );

    await this._adminRepository.modifyPassword(admin.id, newPassword);

    return {};
  }
}
