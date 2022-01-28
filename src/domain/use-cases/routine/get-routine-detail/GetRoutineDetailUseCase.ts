import { UseCase } from "../../UseCase";
import { GetRoutineDetailResponse } from "../response.index";
import { GetRoutineDetailUsecaseParams } from "./dtos/GetRoutineDetailUsecaseParams";

export abstract class GetRoutineDetailUseCase implements UseCase<GetRoutineDetailUsecaseParams, GetRoutineDetailResponse>{
  abstract execute(params: GetRoutineDetailUsecaseParams): GetRoutineDetailResponse;
} 