import { UseCase } from "../../UseCase";
import { GetRoutineDetailResponse } from "../response.index";
import { GetRoutineDetailUsecaseParams } from "./dtos/GetRoutineDetailUsecaseParams";

/**
 * 루틴 상세정보를 가져옴
 */
export abstract class GetRoutineDetailUseCase implements UseCase<GetRoutineDetailUsecaseParams, GetRoutineDetailResponse>{
  abstract execute(params: GetRoutineDetailUsecaseParams): GetRoutineDetailResponse;
} 