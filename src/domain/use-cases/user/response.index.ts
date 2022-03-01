import { DoUserOnboardingResponseDto } from './do-user-onboarding/dtos/DoUserOnboardingResponseDto';
import { FindUserResponseDto } from './find-user/dtos/FindUserResponseDto';

export type FindUserResponse = Promise<FindUserResponseDto>;

export type DoUserOnboardingResponse = Promise<DoUserOnboardingResponseDto>;

export type ModifyUserResponse = Promise<Record<string, never>>;

export type PatchAvatarResponse = Promise<Record<string, never>>;

export type ValidateUsernameResponse = Promise<Record<string, never>>;
