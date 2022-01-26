import { FindUserResponseDto } from "./use-cases/find-user/dtos/FindUserResponseDto";

export type FindUserResponse = Promise<FindUserResponseDto>;
export type DoUserOnboardingResponse = Promise<void>;
export type ModifyUserResponse = Promise<void>;