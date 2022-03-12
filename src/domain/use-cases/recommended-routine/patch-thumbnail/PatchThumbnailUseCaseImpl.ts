import { Injectable } from '@nestjs/common';
import { PatchThumbnailResponse } from '../response.index';
import { PatchThumbnailUseCaseParams } from './dtos/PatchThumbnailUseCaseParams';
import { PatchThumbnailUseCase } from './PatchThumbnailUseCase';
import { ImageProvider } from '../../../providers/ImageProvider';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { ImageType } from '../../../common/enums/ImageType';
import { PutRoutineThumbnailObjectError } from './errors/PutRoutineThumbnailObjectError';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserModel } from '../../../models/UserModel';
import { CommonUserService } from '../../user/common/CommonUserService';
import { UpdateRecommendedRoutineDto } from '../../../repositories/recommended-routine/dtos/UpdateRecommendedRoutineDto';
import { CommonRecommendedRoutineService } from '../common/CommonRecommendedRoutineService';

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
    routineId,
    thumbnail,
  }: PatchThumbnailUseCaseParams): PatchThumbnailResponse {
    //어드민인지 파악
    const user: UserModel = await this._userRepository.findOne(userId);
    CommonUserService.validateAdmin(user);

    //routineId로 루틴 불러오기
    const routine = await this._recommendedRoutineRepository.findOne(routineId);

    //루틴 있나 없나 검사 없으면 exception
    await CommonRecommendedRoutineService.assertRoutineExistence(routine);

    //origin thumbnail mongoose object
    const originThumbnailMongooseObject = routine['thumbnail_id'] ?? null;

    //만약 루틴 썸네일이 이미 있었으면
    if (originThumbnailMongooseObject) {
      //origin thumbnail model
      const originThumbnailModel = this._imageProvider.mapDocumentToImageModel(
        originThumbnailMongooseObject,
      );

      this._imageRepository.delete(originThumbnailMongooseObject);

      this._imageProvider.deleteImageFromS3(
        `routine/${routine.title}/${ImageType.thumbnail}`,
        originThumbnailModel.filenames[0],
      );
    }

    let newThumbnailS3Object: any;

    try {
      newThumbnailS3Object = this._imageProvider.putImageToS3(
        thumbnail,
        `routine/${routine.title}/${ImageType.thumbnail}`,
      );
    } catch (err) {
      throw new PutRoutineThumbnailObjectError();
    }

    const thumbnailData: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByS3Object(
        newThumbnailS3Object,
        ImageType.thumbnail,
        ReferenceModel.Routine,
        routineId,
      );

    const createdThumbnail = await this._imageRepository.create(thumbnailData);

    const createdThumbnailId = createdThumbnail['_id'];

    const updateRoutineData: UpdateRecommendedRoutineDto = {
      thumbnail_id: createdThumbnailId,
    };

    await this._recommendedRoutineRepository.update(
      routineId,
      updateRoutineData,
    );

    return {};
  }
}
