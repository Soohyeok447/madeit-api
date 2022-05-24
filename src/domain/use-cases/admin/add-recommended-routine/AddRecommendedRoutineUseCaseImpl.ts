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

@Injectable()
export class AddRecommendedRoutineUseCaseImpl
  implements AddRecommendedRoutineUseCase
{
  public constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _logger: LoggerProvider,
    private readonly _adminRepository: AdminRepository,
    private readonly _adminAuthProvider: AdminAuthProvider,
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
    this._logger.setContext('AddRecommendedRoutine');

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
      await this._recommendRoutineRepository.findOneByRoutineName(title);

    if (recommendedRoutine) {
      throw new TitleConflictException(
        this._logger.getContext(),
        `중복된 이름의 추천루틴 추가 시도.`,
      );
    }

    const createRecommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.create({
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
      cardnews: [createRecommendedRoutine.cardnewsId],
      thumbnail: createRecommendedRoutine.thumbnailId as string,
      point: createRecommendedRoutine.point,
      exp: createRecommendedRoutine.exp,
      howToProveScript: howToProveYouDidIt.script,
      howToProveImageUrl: howToProveYouDidIt.imageUrl,
    };
  }
}
