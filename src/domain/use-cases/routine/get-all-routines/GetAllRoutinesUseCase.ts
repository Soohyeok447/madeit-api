import { UseCase } from "../../UseCase";
import { GetAllRoutinesResponse } from "../response.index";
import { GetAllRoutinesUsecaseParams } from "./dtos/GetAllRoutinesUsecaseParams";

export abstract class GetAllRoutinesUseCase implements UseCase<GetAllRoutinesUsecaseParams, GetAllRoutinesResponse> {
  abstract execute(params: GetAllRoutinesUsecaseParams): GetAllRoutinesResponse;
}