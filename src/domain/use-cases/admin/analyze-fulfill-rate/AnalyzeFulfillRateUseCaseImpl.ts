import { Injectable } from '@nestjs/common';
import { Admin } from '../../../entities/Admin';
import {
  AdminAuthProvider,
  Payload,
} from '../../../providers/AdminAuthProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { AdminNotFoundException } from '../common/exceptions/AdminNotFoundException';
import { InvalidAdminTokenException } from '../common/exceptions/InvalidAdminTokenException';
import { AnalyzeFulfillRateResponseDto } from './dtos/AnalyzeFulfillRateResponseDto';
import { AnalyzeFulfillRateUseCaseParams } from './dtos/AnalyzeFulfillRateUseCaseParams';
import { AnalyzeFulfillRateUseCase } from './AnalyzeFulfillRateUseCase';

@Injectable()
export class AnalyzeUseWayOfRoutinesUseCaseImpl
  implements AnalyzeFulfillRateUseCase
{
  public constructor(
    private readonly _logger: LoggerProvider,
    private readonly _adminRepository: AdminRepository,
    private readonly _adminAuthProvider: AdminAuthProvider,
    private readonly _routineRepository: RoutineRepository,
  ) {}

  public async execute({
    accessToken,
  }: AnalyzeFulfillRateUseCaseParams): Promise<AnalyzeFulfillRateResponseDto> {
    this._logger.setContext('analyzeFulfillRateContents');

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

    return;
  }
}
