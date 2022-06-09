import { Injectable } from '@nestjs/common';
import { RecommendedRoutineRepository } from '../../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../../repositories/user/UserRepository';
import { ModifyRecommendedRoutineUseCase } from './ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseParams } from './dtos/ModifyRecommendedRoutineUseCaseParams';
import { TitleConflictException } from './exceptions/TitleConflictException';

import { RecommendedRoutine } from '../../../../entities/RecommendedRoutine';
import { LoggerProvider } from '../../../../providers/LoggerProvider';
import { AdminNotFoundException } from '../../common/exceptions/AdminNotFoundException';
import { Admin } from '../../../../entities/Admin';
import { InvalidAdminTokenException } from '../../common/exceptions/InvalidAdminTokenException';
import {
  AdminAuthProvider,
  Payload,
} from '../../../../providers/AdminAuthProvider';
import { AdminRepository } from '../../../../repositories/admin/AdminRepository';
import { ModifyRecommendedRoutineResponseDto } from './dtos/ModifyRecommendedRoutineResponseDto';
import {
  HowToProveYouDidIt,
  RecommendedRoutineUtils,
} from '../../../recommended-routine/common/RecommendedRoutineUtils';
import { RecommendedRoutineNotFoundException } from '../../../recommended-routine/common/exceptions/RecommendedRoutineNotFoundException';
import { YoutubeProvider } from '../../../../providers/YoutubeProvider';

@Injectable()
export class ModifyRecommendedRoutineUseCaseImpl
  implements ModifyRecommendedRoutineUseCase
{
  public constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
    private readonly _adminRepository: AdminRepository,
    private readonly _adminAuthProvider: AdminAuthProvider,
    private readonly youtubeProvider: YoutubeProvider,
  ) {}

  public async execute({
    recommendedRoutineId,
    title,
    category,
    introduction,
    fixedFields,
    hour,
    minute,
    days,
    alarmVideoId,
    contentVideoId,
    timerDuration,
    price,
    point,
    exp,
    accessToken,
  }: ModifyRecommendedRoutineUseCaseParams): Promise<ModifyRecommendedRoutineResponseDto> {
    this._logger.setContext('ModifyRecommendedRoutine');

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
        `미존재 추천루틴 수정 시도.`,
      );
    }

    if (recommendedRoutine.title !== title) {
      const duplicatedTitle: RecommendedRoutine =
        await this._recommendRoutineRepository.findOneByRoutineName(title);

      if (duplicatedTitle) {
        throw new TitleConflictException(
          this._logger.getContext(),
          `중복된 이름을 갖도록 추천루틴 수정 시도.`,
        );
      }
    }

    const youtubeThumbnailUrl: string = contentVideoId
      ? await this.youtubeProvider.getThumbnailUrl(contentVideoId)
      : recommendedRoutine.youtubeThumbnailUrl;

    const updatedRecommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.update(recommendedRoutineId, {
        title,
        category,
        introduction,
        fixedFields,
        hour,
        minute,
        days,
        youtubeThumbnail: youtubeThumbnailUrl,
        alarmVideoId,
        contentVideoId,
        timerDuration,
        price,
        point,
        exp,
      });

    if (!category) category = recommendedRoutine.category;

    const howToProveYouDidIt: HowToProveYouDidIt =
      RecommendedRoutineUtils.getHowToProveByCategory(category);

    return {
      id: updatedRecommendedRoutine.id,
      title: updatedRecommendedRoutine.title,
      category: updatedRecommendedRoutine.category,
      introduction: updatedRecommendedRoutine.introduction,
      fixedFields: updatedRecommendedRoutine.fixedFields,
      hour: updatedRecommendedRoutine.hour,
      minute: updatedRecommendedRoutine.minute,
      days: updatedRecommendedRoutine.days,
      alarmVideoId: updatedRecommendedRoutine.alarmVideoId,
      contentVideoId: updatedRecommendedRoutine.contentVideoId,
      timerDuration: updatedRecommendedRoutine.timerDuration,
      price: updatedRecommendedRoutine.price,
      cardnewsUrl: [updatedRecommendedRoutine.cardnewsId],
      thumbnailUrl: youtubeThumbnailUrl,
      point: updatedRecommendedRoutine.point,
      exp: updatedRecommendedRoutine.exp,
      howToProveScript: howToProveYouDidIt.script,
      howToProveImageUrl: howToProveYouDidIt.imageUrl,
    };
  }
}
