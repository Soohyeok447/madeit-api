import { ApiProperty } from '@nestjs/swagger';

export class ReissueAccessTokenResponse {
  @ApiProperty({ description: 'accessToken' })
  accessToken?: string;
}
