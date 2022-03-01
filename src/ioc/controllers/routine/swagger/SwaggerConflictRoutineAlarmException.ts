import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerConflictRoutineAlarmException
  implements SwaggerServerException
{
  @ApiProperty({ description: '메시지', example: '[1,2] 14:30 중복' })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 2 })
  public errorCode: number;
}
