import { Injectable } from '@nestjs/common';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import {
  RecommendedRoutineUtils,
  HowToProveYouDidIt,
} from '../../recommended-routine/common/RecommendedRoutineUtils';
import { AddRecommendedRoutineResponse } from '../../recommended-routine/response.index';
import { AddRecommendedRoutineUseCase } from './AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineUseCaseParams } from './dtos/AddRecommendedRoutineUseCaseParams';
import { TitleConflictException } from './exceptions/TitleConflictException';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { AdminNotFoundException } from '../common/exceptions/AdminNotFoundException';
import { InvalidAdminTokenException } from '../common/exceptions/InvalidAdminTokenException';
import {
  AdminAuthProvider,
  Payload,
} from '../../../providers/AdminAuthProvider';
import { Admin } from '../../../entities/Admin';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { YoutubeProvider } from '../../../providers/YoutubeProvider';

@Injectable()
export class AddRecommendedRoutineUseCaseImpl
  implements AddRecommendedRoutineUseCase
{
  public constructor(
    private readonly recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly logger: LoggerProvider,
    private readonly adminRepository: AdminRepository,
    private readonly adminAuthProvider: AdminAuthProvider,
    private readonly youtubeProvider: YoutubeProvider,
  ) {}

  public async execute({
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
  }: AddRecommendedRoutineUseCaseParams): AddRecommendedRoutineResponse {
    this.logger.setContext('AddRecommendedRoutine');

    const payload: Payload =
      this.adminAuthProvider.verifyAccessToken(accessToken);

    if (!payload)
      throw new InvalidAdminTokenException(
        this.logger.getContext(),
        `유효하지않은 어드민 토큰입니다.`,
      );

    const admin: Admin = await this.adminRepository.findOneByIndentifier(
      payload.id,
    );

    if (!admin)
      throw new AdminNotFoundException(
        this.logger.getContext(),
        `존재하지 않는 어드민`,
      );

    const recommendedRoutine: RecommendedRoutine =
      await this.recommendRoutineRepository.findOneByRoutineName(title);

    if (recommendedRoutine) {
      throw new TitleConflictException(
        this.logger.getContext(),
        `중복된 이름의 추천루틴 추가 시도.`,
      );
    }

    const youtubeThumbnailUrl: string =
      await this.youtubeProvider.getThumbnailUrl(contentVideoId);

    const createRecommendedRoutine: RecommendedRoutine =
      await this.recommendRoutineRepository.create({
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

    const howToProveYouDidIt: HowToProveYouDidIt =
      RecommendedRoutineUtils.getHowToProveByCategory(category);

    return {
      id: createRecommendedRoutine.id,
      title: createRecommendedRoutine.title,
      category: createRecommendedRoutine.category,
      introduction: createRecommendedRoutine.introduction,
      fixedFields: createRecommendedRoutine.fixedFields,
      hour: createRecommendedRoutine.hour,
      minute: createRecommendedRoutine.minute,
      days: createRecommendedRoutine.days,
      alarmVideoId: createRecommendedRoutine.alarmVideoId,
      contentVideoId: createRecommendedRoutine.contentVideoId,
      timerDuration: createRecommendedRoutine.timerDuration,
      price: createRecommendedRoutine.price,
      cardnewsUrl: [createRecommendedRoutine.cardnewsId],
      thumbnailUrl: youtubeThumbnailUrl,
      point: createRecommendedRoutine.point,
      exp: createRecommendedRoutine.exp,
      howToProveScript: howToProveYouDidIt.script,
      howToProveImageUrl: howToProveYouDidIt.imageUrl,
    };
  }
}
