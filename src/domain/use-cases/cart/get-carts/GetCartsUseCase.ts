import { UseCase } from "../../UseCase";
import { GetCartsResponse } from "../response.index";
import { GetCartsUsecaseParams } from "./dtos/GetCartsUsecaseParams";

/**
 * 모든 장바구니 목록을 가져옵니다.
 * cursor based pagination
 */
export abstract class GetCartsUseCase implements UseCase<GetCartsUsecaseParams, GetCartsResponse> {
  abstract execute(params: GetCartsUsecaseParams): GetCartsResponse;
}