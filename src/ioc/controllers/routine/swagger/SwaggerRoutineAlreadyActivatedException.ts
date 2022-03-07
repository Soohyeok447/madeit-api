import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerRoutineAlreadyActivatedException
  implements SwaggerServerException
{
  @ApiProperty({ description: '메시지', example: '이미 활성화된 루틴입니다' })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 1 })
  public errorCode: number;
}
