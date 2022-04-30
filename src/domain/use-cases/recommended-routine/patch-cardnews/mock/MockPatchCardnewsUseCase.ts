import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../../common/enums/ImageType';
import { ReferenceModel } from '../../../../common/enums/ReferenceModel';
import { UserNotAdminException } from '../../../../common/exceptions/customs/UserNotAdminException';
import { UserNotFoundException } from '../../../../common/exceptions/customs/UserNotFoundException';
import { RecommendedRoutine } from '../../../../entities/RecommendedRoutine';
import { User } from '../../../../entities/User';
import { ImageModel } from '../../../../models/ImageModel';
import { ImageProvider } from '../../../../providers/ImageProvider';
import { CreateImageDto } from '../../../../repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../../repositories/image/ImageRepository';
import { RecommendedRoutineRepository } from '../../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../../repositories/user/UserRepository';
import { RecommendedRoutineNotFoundException } from '../../common/exceptions/RecommendedRoutineNotFoundException';
import { PatchCardnewsResponse } from '../../response.index';
import { PatchCardnewsUseCaseParams } from '../dtos/PatchCardnewsUseCaseParams';
import { PatchCardnewsUseCase } from '../PatchCardnewsUseCase';

@Injectable()
export class MockPatchCardnewsUseCaseImpl implements PatchCardnewsUseCase {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
  ) {}

  public async execute({
    userId,
    recommendedRoutineId,
    cardnews,
  }: PatchCardnewsUseCaseParams): PatchCardnewsResponse {
    const user: User = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    if (recommendedRoutineId === '000000000000000000000000')
      throw new UserNotAdminException();

    //recommendedRoutineId로 추천루틴 불러오기
    const existingRecommendedRoutine: RecommendedRoutine =
      await this._recommendedRoutineRepository.findOne(recommendedRoutineId);

    //추천루틴 있나 없나 검사 없으면 exception
    if (!existingRecommendedRoutine)
      throw new RecommendedRoutineNotFoundException();

    //기존 카드뉴스
    const existingCardnews: any = existingRecommendedRoutine.cardnewsId ?? null;

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
        ImageType.recommendedRoutineCardnews,
        existingRecommendedRoutine.title,
      );
    });

    const createCardnewsDto: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByCloudKey(
        cardnewsCloudKeys,
        ImageType.recommendedRoutineCardnews,
        ReferenceModel.RecommendedRoutine,
        recommendedRoutineId,
      );

    const createdCardnews: ImageModel = await this._imageRepository.create(
      createCardnewsDto,
    );

    await this._recommendedRoutineRepository.update(recommendedRoutineId, {
      cardnewsId: createdCardnews['_id'],
    });

    return {};
  }
}
