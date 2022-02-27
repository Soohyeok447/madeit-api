import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerCartConflictException implements SwaggerServerException {
  @ApiProperty({
    description: '메시지',
    example: '이미 담긴 추천 루틴 존재',
  })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 1 })
  public errorCode: number;
}
