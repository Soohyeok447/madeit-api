import { IsString } from 'class-validator';

export class GoogleAuthRequest {
  @IsString()
  googleAccessToken: string;
}
