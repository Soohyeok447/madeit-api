import { SignInResponseDto } from './sign-in/dtos/SignInResponseDto';
import { ReissueAccessTokenResponseDto } from './reissue-access-token/dtos/ReissueAccessTokenResponseDto';
import { SignUpResponseDto } from './sign-up/dtos/SignUpResponseDto';
import { ValidateResponseDto } from './validate/dtos/ValidateResponseDto';

export type SignOutResponse = Promise<Record<string, never>>;
export type SignInResponse = Promise<SignInResponseDto>;
export type SignUpResponse = Promise<SignUpResponseDto>;
export type ReissueAccessTokenResponse = Promise<ReissueAccessTokenResponseDto>;
export type WithdrawResponse = Promise<Record<string, never>>;
export type ValidateResponse = Promise<ValidateResponseDto>;
