import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
import { UserModel } from '../../../models/UserModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { UpdateRecommendedRoutineDto } from '../../../repositories/recommended-routine/dtos/UpdateRecommendedRoutineDto';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { CommonUserService } from '../../user/common/CommonUserService';
import { PatchCardnewsResponse } from '../response.index';
import { CommonRecommendedRoutineService } from '../common/CommonRecommendedRoutineService';
import { PatchCardnewsUseCaseParams } from './dtos/PatchCardnewsUseCaseParams';
import { PatchCardnewsUseCase } from './PatchCardnewsUseCase';

@Injectable()
export class PatchCardnewsUseCaseImpl implements PatchCardnewsUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
  ) {}

  async execute({
    userId,
    recommendedRoutineId,
    cardnews,
  }: PatchCardnewsUseCaseParams): PatchCardnewsResponse {
    const user: UserModel = await this._userRepository.findOne(userId);
    CommonUserService.validateAdmin(user);

    //recommendedRoutineId로 추천루틴 불러오기
    const existingRecommendedRoutine =
      await this._recommendedRoutineRepository.findOne(recommendedRoutineId);

    //추천루틴 있나 없나 검사 없으면 exception
    CommonRecommendedRoutineService.assertRecommendedRoutineExistence(
      existingRecommendedRoutine,
    );

    //기존 카드뉴스
    const existingCardnews = existingRecommendedRoutine['cardnews_id'] ?? null;

    //만약 추천루틴의 카드뉴스가 이미 있으면 클라우드, 레포지터리에 있는 썸네일 삭제
    if (existingCardnews) {
      this._imageRepository.delete(existingCardnews['_id']);

      existingCardnews['cloud_keys'].forEach((cloudKey: string) => {
        this._imageProvider.deleteImageFileFromCloudDb(cloudKey);
      });
    }

    const cardnewsCloudKeys: string[] = cardnews.map((card) => {
      return this._imageProvider.putImageFileToCloudDb(
        card,
        ImageType.cardnews,
        existingRecommendedRoutine.title,
      );
    });

    const createCardnewsDto: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByCloudKey(
        cardnewsCloudKeys,
        ImageType.cardnews,
        ReferenceModel.RecommendedRoutine,
        recommendedRoutineId,
      );

    const createdCardnews = await this._imageRepository.create(
      createCardnewsDto,
    );

    const createRoutineData: UpdateRecommendedRoutineDto = {
      cardnews_id: createdCardnews['_id'],
    };

    await this._recommendedRoutineRepository.update(
      recommendedRoutineId,
      createRoutineData,
    );

    return {};
  }
}
