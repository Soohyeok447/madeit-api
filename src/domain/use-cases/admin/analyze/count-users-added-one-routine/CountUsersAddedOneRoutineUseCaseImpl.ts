import { Injectable } from '@nestjs/common';
import { Admin } from '../../../../entities/Admin';
import {
  AdminAuthProvider,
  Payload,
} from '../../../../providers/AdminAuthProvider';
import { LoggerProvider } from '../../../../providers/LoggerProvider';
import { AdminRepository } from '../../../../repositories/admin/AdminRepository';
import { RoutineRepository } from '../../../../repositories/routine/RoutineRepository';
import { AdminNotFoundException } from '../../common/exceptions/AdminNotFoundException';
import { InvalidAdminTokenException } from '../../common/exceptions/InvalidAdminTokenException';
import { CountUsersAddedOneRoutineResponseDto } from './dtos/CountUsersAddedOneRoutineResponseDto';
import { CountUsersAddedOneRoutineUseCaseParams } from './dtos/CountUsersAddedOneRoutineUseCaseParams';
import { CountUsersAddedOneRoutineUseCase } from './CountUsersAddedOneRoutineUseCase';
import { UserRepository } from '../../../../repositories/user/UserRepository';
import { Routine } from '../../../../entities/Routine';
import { User } from '../../../../entities/User';

@Injectable()
export class CountUsersAddedOneRoutineUseCaseImpl
  implements CountUsersAddedOneRoutineUseCase
{
  public constructor(
    private readonly _logger: LoggerProvider,
    private readonly _adminRepository: AdminRepository,
    private readonly _adminAuthProvider: AdminAuthProvider,
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    accessToken,
  }: CountUsersAddedOneRoutineUseCaseParams): Promise<CountUsersAddedOneRoutineResponseDto> {
    this._logger.setContext('countUsersAddedOneRoutine');

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

    const routines: Routine[] =
      await this._routineRepository.findAllIncludeDeletedThings();

    const users: User[] = await this._userRepository.findAll();

    const usersAddedOneRoutine: User[] = users.filter((u) => {
      return routines.some((r) => u.id === r.userId);
    });

    return {
      users: usersAddedOneRoutine.length,
    };
  }
}
