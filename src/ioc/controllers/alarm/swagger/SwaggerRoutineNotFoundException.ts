import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerRoutineNotFoundException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '루틴을 찾을 수 없음' })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 1111111111 })
  public errorCode: number;
}
