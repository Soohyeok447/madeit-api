import { ApiProperty } from "@nestjs/swagger";

export class SignInOutput {
  @ApiProperty({ description: 'accessToken' })
  accessToken?: string;

  @ApiProperty({ description: 'refreshToken' })
  refreshToken?: string;
}
