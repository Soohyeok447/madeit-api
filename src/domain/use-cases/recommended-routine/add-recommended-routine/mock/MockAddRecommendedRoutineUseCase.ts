import { Injectable } from '@nestjs/common';
import { UserNotAdminException } from '../../../../common/exceptions/customs/UserNotAdminException';
import { UserNotFoundException } from '../../../../common/exceptions/customs/UserNotFoundException';
import { RecommendedRoutine } from '../../../../entities/RecommendedRoutine';
import { User } from '../../../../entities/User';
import { RecommendedRoutineRepository } from '../../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../../repositories/user/UserRepository';
import {
  HowToProveYouDidIt,
  RecommendedRoutineUtils,
} from '../../common/RecommendedRoutineUtils';
import { AddRecommendedRoutineResponse } from '../../response.index';
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
  ) {}

  public async execute({
    userId,
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
  }: AddRecommendedRoutineUseCaseParams): AddRecommendedRoutineResponse {
    const user: User = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

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
