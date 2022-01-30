import { Injectable } from '@nestjs/common';
import { RoutineModel } from 'src/domain/models/RoutineModel';
import { ImageType } from '../../../enums/ImageType';
import { ReferenceModel } from '../../../enums/ReferenceModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { CreateRoutineDto } from '../../../repositories/routine/dtos/CreateRoutineDto';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { UseCase } from '../../UseCase';
import { AddRoutineResponse } from '../response.index';
import { AddRoutineUseCase } from './AddRoutineUseCase';
import { AddRoutineResponseDto } from './dtos/AddRoutineResponseDto';
import { AddRoutineUsecaseParams } from './dtos/AddRoutineUsecaseParams';
import { PutCardnewsObjectError } from './errors/PutCardnewsObjectError';
import { PutRoutineThumbnailObjectError } from './errors/PutRoutineThumbnailObjectError';
import { RoutineNameConflictException } from './exceptions/RoutineNameConflictException';
import { UserNotAdminException } from './exceptions/UserNotAdminException';

@Injectable()
export class AddRoutineUseCaseImpl implements AddRoutineUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _routineRepository: RoutineRepository,
    private readonly _imageRepository: ImageRepository,
    private readonly _imageProvider: ImageProvider,
  ) { }

  public async execute({
    userId,
    name,
    type,
    category,
    introductionScript,
    motivation,
    price,
    relatedProducts,
    cardnews,
    thumbnail,
  }: AddRoutineUsecaseParams): AddRoutineResponse {
    const user = await this._userRepository.findOne(userId);
    const isAdmin = user['is_admin'];

    if (!isAdmin) {
      throw new UserNotAdminException();
    }

    const duplicatedRoutineName =
      await this._routineRepository.findOneByRoutineName(name);

    if (duplicatedRoutineName) {
      throw new RoutineNameConflictException();
    }

    let newThumbnailS3Object;
    let newCardnewsS3Objects;

    try {
      newThumbnailS3Object = this._imageProvider.putImageToS3(
        thumbnail,
        ImageType.routineThumbnail,
      );
    } catch (err) {
      throw new PutRoutineThumbnailObjectError();
    }

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

    const thumbnailData: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByS3Object(
        newThumbnailS3Object,
        ImageType.routineThumbnail,
        ReferenceModel.Routine,
      );
    const cardnewsData: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByS3Object(
        newCardnewsS3Objects,
        ImageType.cardnews,
        ReferenceModel.Routine,
      );

    const createdThumbnail = await this._imageRepository.create(thumbnailData);
    const createdCardnews = await this._imageRepository.create(cardnewsData);

    const thumbnailId = createdThumbnail['_id'];
    const cardnewsId = createdCardnews['_id'];

    //cardNews Id랑 thumbnail Id를 추가한 createRoutineDTO
    const createRoutineData: CreateRoutineDto = {
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

    const createdRoutine = await this._routineRepository.create(
      createRoutineData,
    );

    const output: RoutineModel = {
      id: createdRoutine["_id"],
      name: createdRoutine["name"],
      category: createdRoutine["category"],
      type: createdRoutine["type"],
      thumbnail: createdRoutine["thumbnail_id"],
      cardnews: createdRoutine["cardnews_id"],
      introductionScript: createdRoutine["introduction_script"],
      motivation: createdRoutine["motivation"],
      price: createdRoutine["price"],
      relatedProducts: createdRoutine["related_products"]
    };

    this._imageRepository.update(cardnewsId, {
      reference_id: createdRoutine.id,
    });
    this._imageRepository.update(thumbnailId, {
      reference_id: createdRoutine.id,
    });

    return output;
  }
}
