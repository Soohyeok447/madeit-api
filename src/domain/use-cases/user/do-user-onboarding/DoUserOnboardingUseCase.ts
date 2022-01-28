import { UseCase } from "../../UseCase";
import { DoUserOnboardingResponse } from "../response.index";
import { DoUserOnboardingUseCaseParams } from "./dtos/DoUserOnboardingUseCaseParams";

export abstract class DoUseronboardingUseCase implements UseCase<DoUserOnboardingUseCaseParams, DoUserOnboardingResponse>{
  abstract execute(params: DoUserOnboardingUseCaseParams): DoUserOnboardingResponse;
}