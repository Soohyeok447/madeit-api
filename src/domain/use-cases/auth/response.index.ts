import { SignInResponseDto } from './sign-in/dtos/SignInResponseDto';
import { ReissueAccessTokenResponseDto } from './reissue-access-token/dtos/ReissueAccessTokenResponseDto';

export type SignOutResponse = Promise<{}>;
export type SignInResonse = Promise<SignInResponseDto>;
export type ReissueAccessTokenResponse = Promise<ReissueAccessTokenResponseDto>;
export type WithdrawResponse = Promise<{}>;
