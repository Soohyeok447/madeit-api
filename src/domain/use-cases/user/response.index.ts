import { FindUserResponseDto } from './find-user/dtos/FindUserResponseDto';

export type FindUserResponse = Promise<FindUserResponseDto>;

export type DoUserOnboardingResponse = Promise<void>;

export type ModifyUserResponse = Promise<void>;

export type PatchAvatarResponse = Promise<void>;