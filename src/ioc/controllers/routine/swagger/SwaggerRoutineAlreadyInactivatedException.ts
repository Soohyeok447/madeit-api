import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerRoutineAlreadyInactivatedException
  implements SwaggerServerException
{
  @ApiProperty({ description: '메시지', example: '이미 비활성화된 루틴입니다' })
  public readonly message: string;

  @ApiProperty({ description: '에러코드', example: 1 })
  public readonly errorCode: number;
}
