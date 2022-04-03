import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerRoutineNotFoundException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '루틴을 찾을 수 없음' })
  public readonly message: string;

  @ApiProperty({ description: '에러코드', example: 71 })
  public readonly errorCode: number;
}
