import { UseCase } from "../../UseCase";
import { GetAllRoutinesResponse } from "../response.index";
import { GetAllRoutinesUsecaseParams } from "./dtos/GetAllRoutinesUsecaseParams";

/**
 * 모든 루틴목록을 가져옴
 * cursor based pagination
 */
export abstract class GetAllRoutinesUseCase implements UseCase<GetAllRoutinesUsecaseParams, GetAllRoutinesResponse> {
  abstract execute(params: GetAllRoutinesUsecaseParams): GetAllRoutinesResponse;
}