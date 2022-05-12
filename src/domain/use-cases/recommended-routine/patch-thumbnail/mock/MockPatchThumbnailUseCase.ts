import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../../common/enums/ImageType';
import { ReferenceModel } from '../../../../common/enums/ReferenceModel';
import { RecommendedRoutine } from '../../../../entities/RecommendedRoutine';
import { ImageModel } from '../../../../models/ImageModel';
import { ImageProvider } from '../../../../providers/ImageProvider';
import { CreateImageDto } from '../../../../repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../../repositories/image/ImageRepository';
import { UpdateRecommendedRoutineDto } from '../../../../repositories/recommended-routine/dtos/UpdateRecommendedRoutineDto';
import { RecommendedRoutineRepository } from '../../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { RecommendedRoutineNotFoundException } from '../../common/exceptions/RecommendedRoutineNotFoundException';
import { PatchThumbnailResponse } from '../../response.index';
import { PatchThumbnailUseCaseParams } from '../dtos/PatchThumbnailUseCaseParams';
import { PatchThumbnailUseCase } from '../PatchThumbnailUseCase';

@Injectable()
export class MockPatchThumbnailUseCaseImpl implements PatchThumbnailUseCase {
  public constructor(
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
  ) {}

  public async execute({
    recommendedRoutineId,
    thumbnail,
  }: PatchThumbnailUseCaseParams): PatchThumbnailResponse {
    //recommendedRoutineId로 추천루틴 불러오기
    const existingRecommendedRoutine: RecommendedRoutine =
      await this._recommendedRoutineRepository.findOne(recommendedRoutineId);

    //추천루틴 있나 없나 검사 없으면 exception
    if (!existingRecommendedRoutine)
      throw new RecommendedRoutineNotFoundException();

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
        ImageType.recommendedRoutineThumbnail,
        existingRecommendedRoutine.title,
      );

    const createThumbnailDto: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByCloudKey(
        [`${newThumbnailCloudKey}`],
        ImageType.recommendedRoutineThumbnail,
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
