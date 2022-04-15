import { Injectable } from '@nestjs/common';
import { PatchThumbnailResponse } from '../response.index';
import { PatchThumbnailUseCaseParams } from './dtos/PatchThumbnailUseCaseParams';
import { PatchThumbnailUseCase } from './PatchThumbnailUseCase';
import { ImageProvider } from '../../../providers/ImageProvider';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { ImageType } from '../../../common/enums/ImageType';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UpdateRecommendedRoutineDto } from '../../../repositories/recommended-routine/dtos/UpdateRecommendedRoutineDto';
import { ImageModel } from '../../../models/ImageModel';
import { UserNotAdminException } from '../../../common/exceptions/customs/UserNotAdminException';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { RecommendedRoutineNotFoundException } from '../common/exceptions/RecommendedRoutineNotFoundException';
import { User } from '../../../entities/User';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class PatchThumbnailUseCaseImpl implements PatchThumbnailUseCase {
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
    thumbnail,
  }: PatchThumbnailUseCaseParams): PatchThumbnailResponse {
    this._logger.setContext('PatchThumbnail');

    const user: User = await this._userRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException(
        this._logger.getContext(),
        `미가입 유저가 추천루틴에 썸네일 추가 시도.`,
      );
    }

    if (!user.isAdmin) {
      throw new UserNotAdminException(
        this._logger.getContext(),
        `비어드민 유저가 추천루틴에 썸네일 추가 시도.`,
      );
    }

    //recommendedRoutineId로 추천루틴 불러오기
    const existingRecommendedRoutine: RecommendedRoutine =
      await this._recommendedRoutineRepository.findOne(recommendedRoutineId);

    //추천루틴 있나 없나 검사 없으면 exception
    if (!existingRecommendedRoutine) {
      throw new RecommendedRoutineNotFoundException(
        this._logger.getContext(),
        `미존재 추천루틴에 썸네일 추가 시도.`,
      );
    }
    //기존 썸네일
    const existingThumbnail: ImageModel =
      existingRecommendedRoutine['thumbnail_id'] ?? null;

    //만약 추천루틴 썸네일이 이미 있으면 클라우드, 레포지터리에 있는 썸네일 삭제
    if (existingThumbnail) {
      this._imageRepository.delete(existingThumbnail['_id']);

      this._imageProvider.deleteImageFileFromCloudDb(
        existingThumbnail['cloud_keys'][0],
      );
    }

    //클라우드에 썸네일파일 저장
    const newThumbnailCloudKey: string =
      this._imageProvider.putImageFileToCloudDb(
        thumbnail,
        ImageType.thumbnail,
        existingRecommendedRoutine.title,
      );

    const createThumbnailDto: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByCloudKey(
        [`${newThumbnailCloudKey}`],
        ImageType.thumbnail,
        ReferenceModel.RecommendedRoutine,
        recommendedRoutineId,
      );

    const createdThumbnail: ImageModel = await this._imageRepository.create(
      createThumbnailDto,
    );

    const updateRecommendedRoutineDto: UpdateRecommendedRoutineDto = {
      thumbnailId: createdThumbnail['_id'],
    };

    await this._recommendedRoutineRepository.update(
      recommendedRoutineId,
      updateRecommendedRoutineDto,
    );

    return {};
  }
}
