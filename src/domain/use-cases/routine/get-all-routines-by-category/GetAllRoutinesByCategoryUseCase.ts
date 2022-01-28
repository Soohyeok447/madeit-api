import { UseCase } from "../../UseCase";
import { GetAllRoutinesByCategoryResponse } from "../response.index";
import { GetAllRoutinesByCategoryUsecaseParams } from "./dtos/GetAllRoutinesByCategoryUsecaseParams";

export abstract class getAllRoutinesByCategoryUseCase implements UseCase<GetAllRoutinesByCategoryUsecaseParams, GetAllRoutinesByCategoryResponse>{
  abstract execute(params: GetAllRoutinesByCategoryUsecaseParams): GetAllRoutinesByCategoryResponse;
}