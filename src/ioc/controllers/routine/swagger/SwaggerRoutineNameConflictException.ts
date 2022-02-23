import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerRoutineNameConflictException
  implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '이미 있는 루틴 이름' })
  public message: string;


  @ApiProperty({ description: '에러코드', example: 1111 })
  public errorCode: number;
}
