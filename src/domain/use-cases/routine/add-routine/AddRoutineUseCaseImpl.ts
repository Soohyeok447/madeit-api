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
import { UserNotAdminException } from '../../user/service/exceptions/UserNotAdminException';
import { UserCommonService } from '../../user/service/UserCommonService';

@Injectable()
export class AddRoutineUseCaseImpl implements AddRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userService: UserCommonService
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
  }: AddRoutineUsecaseParams): AddRoutineResponse {
    await this._userService.validateAdmin(userId);

    const duplicatedRoutineName =
      await this._routineRepository.findOneByRoutineName(name);

    if (duplicatedRoutineName) {
      throw new RoutineNameConflictException();
    }

    //cardNews Id랑 thumbnail Id를 추가한 createRoutineDTO
    const createRoutineData: CreateRoutineDto = {
      name,
      type,
      category,
      introduction_script: introductionScript,
      motivation,
      price,
      related_products: relatedProducts,
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

    return output;
  }
}
