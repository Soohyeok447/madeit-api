import { UseCase } from "../../UseCase";
import { BuyRoutineResponse } from "../response.index";
import { BuyRoutineUsecaseParams } from "./dtos/BuyRoutineUsecaseParams";

export abstract class BuyRoutineUseCase implements UseCase<BuyRoutineUsecaseParams, BuyRoutineResponse> {
  abstract execute(params: BuyRoutineUsecaseParams): BuyRoutineResponse;
}