import { Injectable } from '@nestjs/common';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { DeleteRecommendedRoutineUseCase } from './DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseParams } from './dtos/DeleteRecommendedRoutineUseCaseParams';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import {
  AdminAuthProvider,
  Payload,
} from '../../../providers/AdminAuthProvider';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { InvalidAdminTokenException } from '../../admin/common/exceptions/InvalidAdminTokenException';
import { Admin } from '../../../entities/Admin';
import { AdminNotFoundException } from '../../admin/common/exceptions/AdminNotFoundException';
import { RecommendedRoutineNotFoundException } from '../../recommended-routine/common/exceptions/RecommendedRoutineNotFoundException';
import { DeleteRecommendedRoutineResponseDto } from './dtos/DeleteRecommendedRoutineResponseDto';

@Injectable()
export class DeleteRecommendedRoutineUseCaseImpl
  implements DeleteRecommendedRoutineUseCase
{
  public constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
    private readonly _adminRepository: AdminRepository,
    private readonly _adminAuthProvider: AdminAuthProvider,
  ) {}

  public async execute({
    recommendedRoutineId,
    accessToken,
  }: DeleteRecommendedRoutineUseCaseParams): Promise<DeleteRecommendedRoutineResponseDto> {
    this._logger.setContext('DeleteRecommendedRoutine');

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

    const recommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) {
      throw new RecommendedRoutineNotFoundException(
        this._logger.getContext(),
        `미존재 추천루틴 삭제 시도.`,
      );
    }

    await this._recommendRoutineRepository.delete(recommendedRoutineId);

    return {};
  }
}
