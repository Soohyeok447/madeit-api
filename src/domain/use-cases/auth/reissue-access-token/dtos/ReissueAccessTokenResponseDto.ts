import { ApiProperty } from '@nestjs/swagger';

export class ReissueAccessTokenResponseDto {
  @ApiProperty({ description: 'accessToken' })
  accessToken?: string;
}
