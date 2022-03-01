import { DoUserOnboardingResponseDto } from './do-user-onboarding/dtos/DoUserOnboardingResponseDto';
import { FindUserResponseDto } from './find-user/dtos/FindUserResponseDto';

export type FindUserResponse = Promise<FindUserResponseDto>;

export type DoUserOnboardingResponse = Promise<DoUserOnboardingResponseDto>;

export type ModifyUserResponse = Promise<{}>;

export type PatchAvatarResponse = Promise<{}>;

export type ValidateUsernameResponse = Promise<{}>;