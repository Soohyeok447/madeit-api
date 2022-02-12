import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerCartConflictException implements SwaggerServerException {
  @ApiProperty({
    description: '메시지',
    example: '장바구니에 이미 해당 루틴 존재',
  })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 409 })
  public statusCode: number;

  @ApiProperty({ description: '에러종류', example: 'Conflict' })
  public error: string;
}
