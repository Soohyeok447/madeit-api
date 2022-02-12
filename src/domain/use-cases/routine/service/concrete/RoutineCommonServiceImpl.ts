import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../../../domain/models/RoutineModel';
import { RoutineNotFoundException } from '../../patch-thumbnail/exceptions/RoutineNotFoundException';
import { RoutineCommonService } from '../RoutineCommonService';

@Injectable()
export class RoutineCommonServiceImpl implements RoutineCommonService {
  constructor() {} // private readonly _imageProvider: ImageProvider, // private readonly _imageRepository: ImageRepository, // private readonly _userRepository: UserRepository, // private readonly _routineRepository: RoutineRepository,

  public async assertRoutine(routine: RoutineModel): Promise<void> {
    if (!routine) {
      throw new RoutineNotFoundException();
    }
  }
}
