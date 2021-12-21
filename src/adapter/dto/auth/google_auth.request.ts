import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleAuthRequest {
  @ApiProperty({ description: 'googleAccessToken' })
  @IsString()
  googleAccessToken: string;
}
