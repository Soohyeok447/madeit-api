import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { UserNotAdminException } from '../../user/common/exceptions/UserNotAdminException';
import {
  CommonRecommendedRoutineService,
  HowToProveYouDidIt,
} from '../common/CommonRecommendedRoutineService';
import { AddRecommendedRoutineResponse } from '../response.index';
import { AddRecommendedRoutineUseCase } from './AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineUseCaseParams } from './dtos/AddRecommendedRoutineUseCaseParams';
import { TitleConflictException } from './exceptions/TitleConflictException';

@Injectable()
export class AddRecommendedRoutineUseCaseImpl
  implements AddRecommendedRoutineUseCase
{
  constructor(
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
    const user = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    if (!user.isAdmin) throw new UserNotAdminException();

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
      CommonRecommendedRoutineService.getHowToProveByCategory(category);

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
