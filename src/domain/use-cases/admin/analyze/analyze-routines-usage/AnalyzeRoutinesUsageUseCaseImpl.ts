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
import { AnalyzeRoutinesUsageResponseDto } from './dtos/AnalyzeRoutinesUsageResponseDto';
import { AnalyzeRoutinesUsageUseCaseParams } from './dtos/AnalyzeRoutinesUsageUseCaseParams';
import { AnalyzeRoutinesUsageUseCase } from './AnalyzeRoutinesUsageUseCase';
import { Routine } from '../../../../entities/Routine';
import { MomentProvider } from '../../../../providers/MomentProvider';
import { UserRepository } from '../../../../repositories/user/UserRepository';

@Injectable()
export class AnalyzeRoutinesUsageUseCaseImpl
  implements AnalyzeRoutinesUsageUseCase
{
  public constructor(
    private readonly _logger: LoggerProvider,
    private readonly _adminRepository: AdminRepository,
    private readonly _adminAuthProvider: AdminAuthProvider,
    private readonly _routineRepository: RoutineRepository,
    private readonly _momentProvider: MomentProvider,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    accessToken,
  }: AnalyzeRoutinesUsageUseCaseParams): Promise<
    AnalyzeRoutinesUsageResponseDto[]
  > {
    this._logger.setContext('analyzeRoutinesUsage');

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

    /**
     * [
          { 
            startDate: String,
            value: 5.5,
          }
        ]
     */

    const routines: Routine[] =
      await this._routineRepository.findAllIncludeDeletedThings();

    const routineCreationsAndDeletions: {
      routineCreationsInLastMonth: number;
      routineDeletionsInLastMonth: number;
    } = routines.reduce(
      (acc, cur) => {
        const isCreatedInLastMonth: boolean =
          this._momentProvider.isInLastMonth(cur.createdAt);
        const isDeletedInLastMonth: boolean =
          this._momentProvider.isInLastMonth(cur.deletedAt);

        if (isCreatedInLastMonth) acc.routineCreationsInLastMonth++;
        if (isDeletedInLastMonth) acc.routineDeletionsInLastMonth++;

        return acc;
      },
      {
        routineCreationsInLastMonth: 0,
        routineDeletionsInLastMonth: 0,
      },
    );

    const usersCount: number = (await this._userRepository.findAll()).length;

    console.log({
      averageOfRoutinesCreationsInLastWeek:
        routineCreationsAndDeletions.routineCreationsInLastMonth /
        usersCount /
        4,

      averageOfRoutinesDeletionsInLastWeek:
        routineCreationsAndDeletions.routineCreationsInLastMonth /
        usersCount /
        4,
    });

    return;
  }
}

/**
 * averageOfRoutinesDeletionsPerWeek:
        routineCreationsAndDeletions.routinesDeletionsPerMonth / usersCount / 4,
      averageOfRoutinesDeletionsPerDay:
 */
