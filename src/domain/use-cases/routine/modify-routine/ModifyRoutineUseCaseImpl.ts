import { UpdateRoutineDto } from '../../../repositories/routine/dtos/UpdateRoutineDto';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { RoutineNameConflictException } from '../add-routine/exceptions/RoutineNameConflictException';
import { ModifyRoutineResponse } from '../response.index';
import { ModifyRoutineResponseDto } from './dtos/ModifyRoutineResponseDto';
import { ModifyRoutineUsecaseParams } from './dtos/ModifyRoutineUsecaseParams';
import { Injectable } from '@nestjs/common';
import { ModifyRoutineUseCase } from './ModifyRoutineUseCase';
import { UserCommonService } from '../../user/service/UserCommonService';
import { RoutineCommonService } from '../service/RoutineCommonService';
import { ImageRepository } from 'src/domain/repositories/image/ImageRepository';
import { UpdateImageDto } from 'src/domain/repositories/image/dtos/UpdateImageDto';

@Injectable()
export class ModifyRoutineUseCaseImpl implements ModifyRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userService: UserCommonService,
    private readonly _routineService: RoutineCommonService,
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
  }: ModifyRoutineUsecaseParams): ModifyRoutineResponse {
    await this._userService.validateAdmin(userId);

    const routine = await this._routineRepository.findOne(routineId);

    await this._routineService.assertRoutine(routine);

    const duplicatedRoutineName =
      await this._routineRepository.findOneByRoutineName(name);

    if (duplicatedRoutineName && routine.name !== name) {
      throw new RoutineNameConflictException();
    }

    const updateRoutineData: UpdateRoutineDto = {
      name,
      type,
      category,
      introduction_script: introductionScript,
      motivation,
      price,
      related_products: relatedProducts,
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
