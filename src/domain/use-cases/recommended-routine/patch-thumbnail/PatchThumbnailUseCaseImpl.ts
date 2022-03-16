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
import { UserModel } from '../../../models/UserModel';
import { CommonUserService } from '../../user/common/CommonUserService';
import { UpdateRecommendedRoutineDto } from '../../../repositories/recommended-routine/dtos/UpdateRecommendedRoutineDto';
import { CommonRecommendedRoutineService } from '../common/CommonRecommendedRoutineService';
import { ImageModel } from '../../../models/ImageModel';

@Injectable()
export class PatchThumbnailUseCaseImpl implements PatchThumbnailUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
  ) {}

  async execute({
    userId,
    recommendedRoutineId,
    thumbnail,
  }: PatchThumbnailUseCaseParams): PatchThumbnailResponse {
    //어드민인지 파악
    const user: UserModel = await this._userRepository.findOne(userId);
    CommonUserService.validateAdmin(user);

    //recommendedRoutineId로 추천루틴 불러오기
    const existingRecommendedRoutine =
      await this._recommendedRoutineRepository.findOne(recommendedRoutineId);

    //루틴 있나 없나 검사 없으면 exception
    CommonRecommendedRoutineService.assertRecommendedRoutineExistence(
      existingRecommendedRoutine,
    );

    //기존 썸네일
    const existingThumbnail: ImageModel =
      existingRecommendedRoutine['thumbnail_id'] ?? null;

    //만약 루틴 썸네일이 이미 있으면 클라우드, 레포지터리에 있는 썸네일 삭제
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
      thumbnail_id: createdThumbnail['_id'],
    };

    await this._recommendedRoutineRepository.update(
      recommendedRoutineId,
      updateRecommendedRoutineDto,
    );

    return {};
  }
}
