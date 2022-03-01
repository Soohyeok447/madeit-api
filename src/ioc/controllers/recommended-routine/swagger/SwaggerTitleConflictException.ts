import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerTitleConflictException implements SwaggerServerException {
  @ApiProperty({
    description: '메시지',
    example: '중복되는 추천 루틴 제목 존재',
  })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 1 })
  public errorCode: number;
}
