import { UseCase } from "../../UseCase";
import { DeleteRoutineFromCartResponse } from "../response.index";
import { DeleteRoutineFromCartUsecaseParams } from "./dtos/DeleteRoutineFromCartUsecaseParams";

/**
 * 장바구니에서 루틴 제거
 */
export abstract class DeleteRoutineFromCartUseCase implements UseCase<DeleteRoutineFromCartUsecaseParams, DeleteRoutineFromCartResponse> {
  abstract execute(params: DeleteRoutineFromCartUsecaseParams): DeleteRoutineFromCartResponse;
}