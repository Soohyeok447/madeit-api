import { ApiProperty } from '@nestjs/swagger';

export class ReissueAccessTokenResponseDto {
  @ApiProperty({ description: 'accessToken' })
  public readonly accessToken?: string;
}
