import { Injectable } from "@nestjs/common";
import { RoutineModel } from "src/domain/models/RoutineModel";
import { RoutineRepository } from "src/domain/repositories/routine/RoutineRepository";
import { RoutineNotFoundException } from "../../patch-thumbnail/exceptions/RoutineNotFoundException";
import { RoutineCommonService } from "../RoutineCommonService";

@Injectable()
export class RoutineCommonServiceImpl implements RoutineCommonService {

  constructor(
    // private readonly _routineRepository: RoutineRepository,
    // private readonly _userRepository: UserRepository,
    // private readonly _imageRepository: ImageRepository,
    // private readonly _imageProvider: ImageProvider,
  ) { }

  public async assertRoutine(
    routine: RoutineModel
  ): Promise<void> {
    if (!routine) {
      throw new RoutineNotFoundException();
    }
  }

}