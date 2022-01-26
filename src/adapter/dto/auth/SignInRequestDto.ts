import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({ description: 'thirdPartyAccessToken' })
  @IsString()
  thirdPartyAccessToken: string;
}
