import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerConflictRoutineAlarmException
  implements SwaggerServerException
{
  @ApiProperty({
    description: '메시지',
    example: '평일 오후 12시 40분에는 이미 진행할 루틴이 있습니다',
  })
  public readonly message: string;

  @ApiProperty({ description: '에러코드', example: 2 })
  public readonly errorCode: number;
}
