import { UseCase } from "../../UseCase";
import { GetRecommendedRoutinesResponse } from "../response.index";
import { GetRecommendedRoutinesUseCaseParams } from "./dtos/GetRecommendedRoutinesUseCaseParams";

export abstract class GetRecommendedRoutinesUseCase implements UseCase<GetRecommendedRoutinesUseCaseParams, GetRecommendedRoutinesResponse> {
  abstract execute({
    next,
    size
  }: GetRecommendedRoutinesUseCaseParams): GetRecommendedRoutinesResponse;

}