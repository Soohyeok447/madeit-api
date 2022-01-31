import { ImageProvider } from '../../../providers/ImageProvider';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { ImageType } from '../../../enums/ImageType';
import { ReferenceModel } from '../../../enums/ReferenceModel';
import { UpdateRoutineDto } from '../../../repositories/routine/dtos/UpdateRoutineDto';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { RoutineNameConflictException } from '../add-routine/exceptions/RoutineNameConflictException';
import { UserNotAdminException } from '../add-routine/exceptions/UserNotAdminException';
import { ModifyRoutineResponse } from '../response.index';
import { ModifyRoutineResponseDto } from './dtos/ModifyRoutineResponseDto';
import { ModifyRoutineUsecaseParams } from './dtos/ModifyRoutineUsecaseParams';
import { Injectable } from '@nestjs/common';
import { ModifyRoutineUseCase } from './ModifyRoutineUseCase';
import { PutRoutineThumbnailObjectError } from './errors/PutRoutineThumbnailObjectError';
import { PutCardnewsObjectError } from './errors/PutCardnewsObjectError';
import { RoutineNotFoundException } from 'src/domain/common/exceptions/RoutineNotFoundException';

@Injectable()
export class ModifyRoutineUseCaseImpl implements ModifyRoutineUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _routineRepository: RoutineRepository,
    private readonly _imageRepository: ImageRepository,
    private readonly _imageProvider: ImageProvider,
  ) { }

  public async execute({
    userId,
    routineId,
    name,
    type,
    category,
    introductionScript,
    motivation,
    price,
    relatedProducts,
    cardnews,
    thumbnail,
  }: ModifyRoutineUsecaseParams): ModifyRoutineResponse {
    const user = await this._userRepository.findOne(userId);
    const isAdmin = user['is_admin'];

    if (!isAdmin) {
      throw new UserNotAdminException();
    }

    const routine = await this._routineRepository.findOne(routineId);

    if(!routine){
      throw new RoutineNotFoundException()
    }

    const duplicatedRoutineName =
      await this._routineRepository.findOneByRoutineName(name);

    if (duplicatedRoutineName && routine.name !== name) {
      throw new RoutineNameConflictException();
    }

    const originThumbnailObject = routine['thumbnail_id'];
    const originCardnewsObject = routine['cardnews_id'];

    const originThumbnailModel = this._imageProvider.mapDocumentToImageModel(
      originThumbnailObject,
    );
    const originCardnewsModel =
      this._imageProvider.mapDocumentToImageModel(originCardnewsObject);

    let thumbnailId = originThumbnailModel['_id'];
    let cardnewsId = originCardnewsModel['_id'];

    let newThumbnailS3Object: any;
    let newCardnewsS3Objects: any;

    if (thumbnail) {
      try {
        newThumbnailS3Object = this._imageProvider.putImageToS3(
          thumbnail,
          ImageType.routineThumbnail,
        );
      } catch (err) {
        throw new PutRoutineThumbnailObjectError();
      }

      const thumbnailData: CreateImageDto =
        this._imageProvider.mapCreateImageDtoByS3Object(
          newThumbnailS3Object,
          ImageType.routineThumbnail,
          ReferenceModel.Routine,
          routine.id,
        );

      const createdThumbnail = await this._imageRepository.create(
        thumbnailData,
      );

      thumbnailId = createdThumbnail['_id'];

      this._imageRepository.delete(originThumbnailModel.id);
      this._imageProvider.deleteImageFromS3(
        originThumbnailModel.key,
        originThumbnailModel.filenames[0],
      );
    }

    if (cardnews) {
      try {
        newCardnewsS3Objects = cardnews.map((e) => {
          return this._imageProvider.putImageToS3(
            e,
            `${ImageType.cardnews}/${name}`,
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
          routine.id,
        );

      const createdCardnews = await this._imageRepository.create(cardnewsData);

      cardnewsId = createdCardnews['_id'];

      this._imageRepository.delete(originCardnewsModel.id);

      originCardnewsModel.filenames.forEach((filename) => {
        this._imageProvider.deleteImageFromS3(
          originCardnewsModel.key,
          filename,
        );
      });
    }

    //cardNews Id랑 thumbnail Id를 추가한 UpdateRoutineDTO
    const updateRoutineData: UpdateRoutineDto = {
      name,
      type,
      category,
      introduction_script: introductionScript,
      motivation,
      price,
      related_products: relatedProducts,
      thumbnail_id: thumbnailId,
      cardnews_id: cardnewsId,
    };

    const updatedRoutine = await this._routineRepository.update(
      routineId,
      updateRoutineData,
    );

    const output: ModifyRoutineResponseDto = {
      id: updatedRoutine["_id"],
      name: updatedRoutine["name"],
      category: updatedRoutine["category"],
      type: updatedRoutine["type"],
      thumbnail: updatedRoutine["thumbnail_id"],
      cardnews: updatedRoutine["cardnews_id"],
      introductionScript: updatedRoutine["introduction_script"],
      motivation: updatedRoutine["motivation"],
      price: updatedRoutine["price"],
    };

    return output;
  }
}
