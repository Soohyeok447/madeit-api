import { UseCase } from "../../UseCase";
import { ModifyUserResponse } from "../response.index";
import { ModifyUserUsecaseParams } from "./dtos/ModifyUserUsecaseParams";

export abstract class ModifyUserUseCase implements UseCase<ModifyUserUsecaseParams, ModifyUserResponse>{
  abstract execute(params: ModifyUserUsecaseParams): ModifyUserResponse
}