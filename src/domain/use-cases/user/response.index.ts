import { DoUserOnboardingResponseDto } from './do-user-onboarding/dtos/DoUserOnboardingResponseDto';
import { FindUserResponseDto } from './find-user/dtos/FindUserResponseDto';

export type FindUserResponse = Promise<FindUserResponseDto>;

export type DoUserOnboardingResponse = Promise<DoUserOnboardingResponseDto>;

export type ModifyUserResponse = Promise<void>;

export type PatchAvatarResponse = Promise<void>;

export type ValidateUsernameResponse = Promise<boolean>;
