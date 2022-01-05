import { ApiProperty } from "@nestjs/swagger";

export class ReissueAccessTokenOutput {
  @ApiProperty({ description: 'accessToken' })
  accessToken?: string;
}
