import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerInvalidTimeException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '유효하지않은 time 2600' })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 111111111 })
  public errorCode: number;
}
