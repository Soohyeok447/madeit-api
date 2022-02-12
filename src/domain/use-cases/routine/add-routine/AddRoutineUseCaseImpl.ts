import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../../domain/models/RoutineModel';
import { CreateRoutineDto } from '../../../repositories/routine/dtos/CreateRoutineDto';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { AddRoutineResponse } from '../response.index';
import { AddRoutineUseCase } from './AddRoutineUseCase';
import { AddRoutineUsecaseParams } from './dtos/AddRoutineUsecaseParams';
import { RoutineNameConflictException } from './exceptions/RoutineNameConflictException';
import { UserCommonService } from '../../user/service/UserCommonService';

@Injectable()
export class AddRoutineUseCaseImpl implements AddRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userService: UserCommonService,
  ) {}

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
      price: +price,
      related_products: relatedProducts,
    };

    const createdRoutine = await this._routineRepository.create(
      createRoutineData,
    );

    const output: RoutineModel = {
      id: createdRoutine['_id'],
      name: createdRoutine['name'],
      category: createdRoutine['category'],
      type: createdRoutine['type'],
      thumbnail: createdRoutine['thumbnail_id'],
      cardnews: createdRoutine['cardnews_id'],
      introductionScript: createdRoutine['introduction_script'],
      motivation: createdRoutine['motivation'],
      price: createdRoutine['price'],
      relatedProducts: createdRoutine['related_products'],
    };

    return output;
  }
}
