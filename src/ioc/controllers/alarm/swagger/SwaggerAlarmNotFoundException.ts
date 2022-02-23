import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerAlarmNotFoundException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '알람이 없음' })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 11111111 })
  public errorCode: number;
}
