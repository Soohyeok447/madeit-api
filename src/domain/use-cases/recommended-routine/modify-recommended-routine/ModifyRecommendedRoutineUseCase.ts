import { UseCase } from "../../UseCase";
import { AddRecommendedRoutineResponse } from "../response.index";
import { ModifyRecommendedRoutineUseCaseParams } from "./dtos/ModifyRecommendedRoutineUseCaseParams";

export abstract class ModifyRecommendedRoutineUseCase implements UseCase<ModifyRecommendedRoutineUseCaseParams, AddRecommendedRoutineResponse> {
  abstract execute({
    userId,
    recommendedRoutineId,
    title,
    category,
    introduction,
    fixedFields,
    hour,
    minute,
    days,
    alarmVideoId,
    contentVideoId,
    timerDuration,
    price,
  }: ModifyRecommendedRoutineUseCaseParams): AddRecommendedRoutineResponse;

}