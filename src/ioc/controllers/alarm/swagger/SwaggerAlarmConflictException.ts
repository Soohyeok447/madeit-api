import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerAlarmConflictException implements SwaggerServerException {
  @ApiProperty({
    description: '메시지',
    example: `["Monday", "Tuesday"] 1300 중복`,
  })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 1111111 })
  public errorCode: number;
}
