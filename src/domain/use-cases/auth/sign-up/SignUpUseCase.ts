import { UseCase } from "../../UseCase";
import { SignUpResponse } from "../response.index";
import { SignUpUseCaseParams } from "./dtos/SignUpUseCaseParams";

/**
 * validate이후 response statusCode가 404면
 * 회원가입을 진행 후 토큰을 발급합니다.
 */
export abstract class SignUpUseCase implements UseCase<SignUpUseCaseParams, SignUpResponse>{
  abstract execute({
    provider,
    thirdPartyAccessToken,
    username,
    age,
    goal,
    statusMessage
  }: SignUpUseCaseParams): SignUpResponse
}