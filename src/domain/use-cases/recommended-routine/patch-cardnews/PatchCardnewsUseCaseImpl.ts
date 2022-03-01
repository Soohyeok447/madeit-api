import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../enums/ImageType';
import { ReferenceModel } from '../../../enums/ReferenceModel';
import { UserModel } from '../../../models/UserModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { UpdateRecommendedRoutineDto } from '../../../repositories/recommended-routine/dtos/UpdateRecommendedRoutineDto';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { CommonUserService } from '../../user/service/CommonUserService';
import { PatchCardnewsResponse } from '../response.index';
import { CommonRecommendedRoutineService } from '../service/CommonRecommendedRoutineService';
import { PatchCardnewsUseCaseParams } from './dtos/PatchCardnewsUseCaseParams';
import { PutCardnewsObjectError } from './errors/PutCardnewsObjectError';
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
    routineId,
    cardnews,
  }: PatchCardnewsUseCaseParams): PatchCardnewsResponse {
    const user: UserModel = await this._userRepository.findOne(userId);
    CommonUserService.validateAdmin(user);

    //routineId로 루틴 불러오기
    const routine = await this._recommendedRoutineRepository.findOne(routineId);

    //루틴 있나 없나 검사 없으면 exception
    await CommonRecommendedRoutineService.assertRoutineExistence(routine);

    const originCardnewsMongooseObject = routine['cardnews_id'] ?? null;

    if (originCardnewsMongooseObject) {
      const originCardnewsModel = this._imageProvider.mapDocumentToImageModel(
        originCardnewsMongooseObject,
      );

      this._imageRepository.delete(originCardnewsMongooseObject);

      originCardnewsModel.filenames.forEach((filename) => {
        this._imageProvider.deleteImageFromS3(
          `routine/${routine.title}/${ImageType.cardnews}`,
          filename,
        );
      });
    }

    let newCardnewsS3Objects: any;

    try {
      newCardnewsS3Objects = cardnews.map((e) => {
        return this._imageProvider.putImageToS3(
          e,
          `routine/${routine.title}/${ImageType.cardnews}`,
        );
      });
    } catch (err) {
      throw new PutCardnewsObjectError();
    }

    const cardnewsData: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByS3Object(
        newCardnewsS3Objects,
        ImageType.cardnews,
        ReferenceModel.Routine,
        routineId,
      );

    const createdCardnews = await this._imageRepository.create(cardnewsData);

    const createdcardnewsId = createdCardnews['_id'];

    const createRoutineData: UpdateRecommendedRoutineDto = {
      cardnews_id: createdcardnewsId,
    };

    await this._recommendedRoutineRepository.update(
      routineId,
      createRoutineData,
    );

    return {};
  }
}
