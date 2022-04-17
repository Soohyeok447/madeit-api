import { CommonUserResponseDto } from './common/CommonUserResponseDto';
import { ValidateUsernameResponseDto } from './validate-username/dtos/ValidateUsernameResponseDto';

export type FindUserResponse = Promise<CommonUserResponseDto>;

export type ModifyUserResponse = Promise<CommonUserResponseDto>;

export type PatchAvatarResponse = Promise<CommonUserResponseDto>;

export type ValidateUsernameResponse = Promise<ValidateUsernameResponseDto>;
