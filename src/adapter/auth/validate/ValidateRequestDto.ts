import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateRequestDto {
  @ApiProperty({
    description: 'thirdPartyAccessToken',
    example:
      'fdasdfs0dsfa89udfsa987iq234ruir32kjefuiofaewuiofei7yfriyf3q2iuoyhq32fhuioq23fuhq23fhkujfq32jkha3ef',
  })
  @IsString()
  thirdPartyAccessToken: string;
}
