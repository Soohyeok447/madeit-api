import { Injectable } from '@nestjs/common';
import { Category } from '../../../common/enums/Category';
import { FixedField } from '../../../common/enums/FixedField';
import { RecommendedRoutineModel } from '../../../models/RecommendedRoutineModel';
import { UserModel } from '../../../models/UserModel';
import { CreateRecommendedRoutineDto } from '../../../repositories/recommended-routine/dtos/CreateRecommendedRoutineDto';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { CommonUserService } from '../../user/common/CommonUserService';
import { AddRecommendedRoutineResponse } from '../response.index';
import { ModifyRecommendedRoutineUseCase } from './ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineResponseDto } from './dtos/ModifyRecommendedRoutineResponseDto';
import { ModifyRecommendedRoutineUseCaseParams } from './dtos/ModifyRecommendedRoutineUseCaseParams';
import { TitleConflictException } from './exceptions/TitleConflictException';
import { CommonRecommendedRoutineService } from '../common/CommonRecommendedRoutineService';
import { UpdateRecommendedRoutineDto } from '../../../repositories/recommended-routine/dtos/UpdateRecommendedRoutineDto';

@Injectable()
export class ModifyRecommendedRoutineUseCaseImpl
  implements ModifyRecommendedRoutineUseCase
{
  constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    userId,
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
  }: ModifyRecommendedRoutineUseCaseParams): AddRecommendedRoutineResponse {
    const user: UserModel = await this._userRepository.findOne(userId);

    CommonUserService.validateAdmin(user);

    const recommendedRoutine: RecommendedRoutineModel =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    CommonRecommendedRoutineService.assertRoutineExistence(recommendedRoutine);

    if (recommendedRoutine.title !== title)
      await this._assertTitleDuplication(title);

    const updateRecommendedRoutineDto: UpdateRecommendedRoutineDto =
      this._mapParamsToUpdateDto(
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
      );

    const result: RecommendedRoutineModel =
      await this._recommendRoutineRepository.update(
        recommendedRoutineId,
        updateRecommendedRoutineDto,
      );

    const output: ModifyRecommendedRoutineResponseDto =
      this._mapModelToResponseDto(result);

    return output;
  }

  private _mapModelToResponseDto(
    result: RecommendedRoutineModel,
  ): ModifyRecommendedRoutineResponseDto {
    return {
      id: result['_id'],
      title: result['title'],
      category: result['category'],
      introduction: result['introduction'],
      fixedFields: result['fixed_fields'],
      hour: result['hour'],
      minute: result['minute'],
      days: result['days'],
      alarmVideoId: result['alarm_video_id'],
      contentVideoId: result['content_video_id'],
      timerDuration: result['timer_duration'],
      price: result['price'],
      cardnews: result['cardnews_id'],
      thumbnail: result['thumbnail_id'],
      point: result['point'],
      exp: result['exp'],
    };
  }

  private _mapParamsToUpdateDto(
    title: string,
    category: Category,
    introduction: string,
    fixedFields: FixedField[],
    hour: number,
    minute: number,
    days: number[],
    alarmVideoId: string,
    contentVideoId: string,
    timerDuration: number,
    price: number,
  ): CreateRecommendedRoutineDto {
    return {
      title,
      category,
      introduction,
      fixed_fields: fixedFields,
      hour,
      minute,
      days,
      alarm_video_id: alarmVideoId,
      content_video_id: contentVideoId,
      timer_duration: timerDuration,
      price,
    };
  }

  private async _assertTitleDuplication(title: string) {
    const recommendedRoutine: RecommendedRoutineModel =
      await this._recommendRoutineRepository.findOneByRoutineName(title);

    if (recommendedRoutine) {
      throw new TitleConflictException();
    }
  }
}
