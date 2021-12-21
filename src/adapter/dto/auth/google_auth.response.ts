import { ApiProperty } from "@nestjs/swagger";

export class GoogleAuthResponse {
  /**
   * both of them will return if user is exist
   */
  @ApiProperty({ description: 'accessToken' })
  accessToken?: string;

  @ApiProperty({ description: 'refreshToken' })
  refreshToken?: string;
}
