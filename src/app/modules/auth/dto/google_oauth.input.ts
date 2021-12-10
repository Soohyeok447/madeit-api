import { IsString } from "class-validator";

export class GoogleOauthInput {
  @IsString()
  googleAccessToken: string;
}