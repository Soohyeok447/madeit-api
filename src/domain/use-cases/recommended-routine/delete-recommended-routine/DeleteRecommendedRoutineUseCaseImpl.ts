import { Injectable } from "@nestjs/common";
import { RecommendedRoutineModel } from "../../../models/RecommendedRoutineModel";
import { UserModel } from "../../../models/UserModel";
import { RecommendedRoutineRepository } from "../../../repositories/recommended-routine/RecommendedRoutineRepository";
import { UserRepository } from "../../../repositories/user/UserRepository";
import { CommonUserService } from "../../user/service/CommonUserService";
import { DeleteRecommendedRoutineResponse } from "../response.index";
import { DeleteRecommendedRoutineUseCase } from "./DeleteRecommendedRoutineUseCase";
import { DeleteRecommendedRoutineUseCaseParams } from "./dtos/DeleteRecommendedRoutineUseCaseParams";
import { CommonRecommendedRoutineService } from "../service/CommonRecommendedRoutineService";

@Injectable()
export class DeleteRecommendedRoutineUseCaseImpl implements DeleteRecommendedRoutineUseCase {
  constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _userRepository: UserRepository
  ) { }

  public async execute({
    userId,
    recommendedRoutineId,
  }: DeleteRecommendedRoutineUseCaseParams): DeleteRecommendedRoutineResponse {
    const user: UserModel = await this._userRepository.findOne(userId);

    CommonUserService.validateAdmin(user);

    const recommendedRoutine: RecommendedRoutineModel = await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    CommonRecommendedRoutineService.assertRoutineExistence(recommendedRoutine);

    await this._recommendRoutineRepository.delete(recommendedRoutineId);
  }
}