import { Injectable } from '@nestjs/common';
import { UserNotAdminException } from '../../../../common/exceptions/customs/UserNotAdminException';
import { RecommendedRoutine } from '../../../../entities/RecommendedRoutine';
import { AdminAuthProvider } from '../../../../providers/AdminAuthProvider';
import { LoggerProvider } from '../../../../providers/LoggerProvider';
import { AdminRepository } from '../../../../repositories/admin/AdminRepository';
import { RecommendedRoutineRepository } from '../../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../../repositories/user/UserRepository';
import {
  HowToProveYouDidIt,
  RecommendedRoutineUtils,
} from '../../../recommended-routine/common/RecommendedRoutineUtils';
import { AddRecommendedRoutineResponse } from '../../../recommended-routine/response.index';
import { AddRecommendedRoutineUseCase } from '../AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineUseCaseParams } from '../dtos/AddRecommendedRoutineUseCaseParams';
import { TitleConflictException } from '../exceptions/TitleConflictException';

@Injectable()
export class MockAddRecommendedRoutineUseCaseImpl
  implements AddRecommendedRoutineUseCase
{
  public constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _userRepository: UserRepository,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    accessToken,
  }: AddRecommendedRoutineUseCaseParams): AddRecommendedRoutineResponse {
    this._logger.setContext('AddRecommendedRoutine');

    if (title === 'UserIsNotAdmin') throw new UserNotAdminException();

    const recommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.findOneByRoutineName(title);

    if (recommendedRoutine) throw new TitleConflictException();

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
