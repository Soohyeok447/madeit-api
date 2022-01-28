import { SignInResponseDto } from "./sign-in/dtos/SignInResponseDto";
import { ReissueAccessTokenResponseDto } from "./reissue-access-token/dtos/ReissueAccessTokenResponseDto";

export type SignOutResponse = Promise<void>;
export type SignInResonse = Promise<SignInResponseDto>;
export type ReissueAccessTokenResponse = Promise<ReissueAccessTokenResponseDto>;