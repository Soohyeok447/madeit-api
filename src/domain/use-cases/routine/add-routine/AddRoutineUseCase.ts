import { UseCase } from "../../UseCase";
import { AddRoutineResponse } from "../response.index";
import { AddRoutineUsecaseParams } from "./dtos/AddRoutineUsecaseParams";

export abstract class AddRoutineUseCase implements UseCase<AddRoutineUsecaseParams, AddRoutineResponse> {
  abstract execute(params: AddRoutineUsecaseParams): AddRoutineResponse;
}