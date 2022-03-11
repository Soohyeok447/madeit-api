import { FindUserResponseDto } from './find-user/dtos/FindUserResponseDto';
import { PatchAvatarResponseDto } from './patch-avatar/dtos/PatchAvatarResponseDto';

export type FindUserResponse = Promise<FindUserResponseDto>;

export type ModifyUserResponse = Promise<Record<string, never>>;

export type PatchAvatarResponse = Promise<PatchAvatarResponseDto>;

export type ValidateUsernameResponse = Promise<Record<string, never>>;
