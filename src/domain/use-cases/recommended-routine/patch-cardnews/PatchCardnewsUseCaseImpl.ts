import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { PatchCardnewsResponse } from '../response.index';
import { PatchCardnewsUseCaseParams } from './dtos/PatchCardnewsUseCaseParams';
import { PatchCardnewsUseCase } from './PatchCardnewsUseCase';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { UserNotAdminException } from '../../../common/exceptions/customs/UserNotAdminException';
import { RecommendedRoutineNotFoundException } from '../common/exceptions/RecommendedRoutineNotFoundException';
import { User } from '../../../entities/User';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { ImageModel } from '../../../models/ImageModel';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class PatchCardnewsUseCaseImpl implements PatchCardnewsUseCase {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    userId,
    recommendedRoutineId,
    cardnews,
  }: PatchCardnewsUseCaseParams): PatchCardnewsResponse {
    this._logger.setContext('PatchCardnews');

    const user: User = await this._userRepository.findOne(userId);

    if (!user) {
      this._logger.error(
        `미가입 유저가 추천루틴에 카드뉴스 추가 시도. 호출자 id - ${userId}`,
      );
      throw new UserNotFoundException();
    }

    if (!user.isAdmin) {
      this._logger.error(
        `비어드민 유저가 추천루틴에 카드뉴스 추가 시도. 호출자 id - ${userId}`,
      );
      throw new UserNotAdminException();
    }
    //recommendedRoutineId로 추천루틴 불러오기
    const existingRecommendedRoutine: RecommendedRoutine =
      await this._recommendedRoutineRepository.findOne(recommendedRoutineId);

    //추천루틴 있나 없나 검사 없으면 exception
    if (!existingRecommendedRoutine) {
      this._logger.error(
        `미존재 추천루틴에 카드뉴스 추가 시도. 호출자 id - ${userId}`,
      );
      throw new RecommendedRoutineNotFoundException();
    }

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

    const createdCardnews: ImageModel = await this._imageRepository.create(
      createCardnewsDto,
    );

    await this._recommendedRoutineRepository.update(recommendedRoutineId, {
      cardnewsId: createdCardnews['_id'],
    });

    return {};
  }
}
