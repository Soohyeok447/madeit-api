import { UseCase } from "../../UseCase";
import { ModifyUserResponse } from "../response.index";
import { ModifyUserUsecaseParams } from "./dtos/ModifyUserUsecaseParams";

/**
 * 유저 정보 수정
 *
 * 프로필 사진 수정, 삭제 가능
 */
export abstract class ModifyUserUseCase implements UseCase<ModifyUserUsecaseParams, ModifyUserResponse>{
  abstract execute(params: ModifyUserUsecaseParams): ModifyUserResponse
}