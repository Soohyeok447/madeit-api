import { AddRoutineResponse } from "../../routine/response.index";
import { UseCase } from "../../UseCase";
import { AddRoutineToCartResponse } from "../response.index";
import { AddRoutineToCartUsecaseParams } from "./dtos/AddRoutineToCartUsecaseParams";


/**
 * 루틴을 장바구니에 담기
 *
 * 만약 장바구니에 없는 루틴이면 새로 추가한다.
 *
 * 이미 장바구니에 있는 루틴이면 exception처리
 * 
 */
export abstract class AddRoutineToCartUseCase implements UseCase<AddRoutineToCartUsecaseParams, AddRoutineToCartResponse> {
  abstract execute(params: AddRoutineToCartUsecaseParams): AddRoutineToCartResponse;
}