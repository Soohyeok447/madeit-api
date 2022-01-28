import { UseCase } from "../../UseCase";
import { SignInResonse } from "../response.index";
import { SignInUsecaseParams } from "./dtos/SignInUsecaseParams";

export abstract class SignInUseCase implements UseCase<SignInUsecaseParams, SignInResonse> {
  abstract execute(params: SignInUsecaseParams): SignInResonse;
}