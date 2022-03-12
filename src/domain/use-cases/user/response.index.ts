import { CommonUserResponseDto } from './common/CommonUserResponseDto';

export type FindUserResponse = Promise<CommonUserResponseDto>;

export type ModifyUserResponse = Promise<CommonUserResponseDto>;

export type PatchAvatarResponse = Promise<CommonUserResponseDto>;

export type ValidateUsernameResponse = Promise<Record<string, never>>;
