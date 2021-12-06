import { IsString } from "class-validator";

export class GoogleOauthInput {
  @IsString()
  googleAccessToken: string;
}


export class GoogleOauthOutput {
  /**
   * both of them will return if user is exist
   */
  accessToken?: string;

  refreshToken?: string;
}

