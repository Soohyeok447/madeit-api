import { Injectable } from '@nestjs/common';
import { Admin } from '../../../entities/Admin';
import { User } from '../../../entities/User';
import {
  AdminAuthProvider,
  Payload,
} from '../../../providers/AdminAuthProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { AdminNotFoundException } from '../common/exceptions/AdminNotFoundException';
import { InvalidAdminTokenException } from '../common/exceptions/InvalidAdminTokenException';
import { CountActiveUsersResponseDto } from './dtos/CountActiveUsersResponseDto';
import { CountActiveUsersUseCaseParams } from './dtos/CountActiveUsersUseCaseParams';
import { CountActiveUsersUseCase } from './CountActiveUsersUseCase';
import { GoogleAnalyticsProvider } from '../../../providers/GoogleAnalyticsProvider';

@Injectable()
export class CountActiveUsersUseCaseImpl implements CountActiveUsersUseCase {
  public constructor(
    private readonly _logger: LoggerProvider,
    private readonly _adminRepository: AdminRepository,
    private readonly _adminAuthProvider: AdminAuthProvider,
    private readonly _userRepository: UserRepository,
    private readonly _googleAnalyticsProvider: GoogleAnalyticsProvider,
  ) {}

  public async execute({
    accessToken,
  }: CountActiveUsersUseCaseParams): Promise<CountActiveUsersResponseDto> {
    this._logger.setContext('countActiveUsers');

    const payload: Payload =
      this._adminAuthProvider.verifyAccessToken(accessToken);

    if (!payload)
      throw new InvalidAdminTokenException(
        this._logger.getContext(),
        `유효하지않은 어드민 토큰입니다.`,
      );

    const admin: Admin = await this._adminRepository.findOneByIndentifier(
      payload.id,
    );

    if (!admin)
      throw new AdminNotFoundException(
        this._logger.getContext(),
        `존재하지 않는 어드민`,
      );

    const users: User[] = await this._userRepository.findAll();

    //test
    const activeUsers: number =
      await this._googleAnalyticsProvider.getActiveUsers();

    return { members: users.length, activeUsers };
  }
}
