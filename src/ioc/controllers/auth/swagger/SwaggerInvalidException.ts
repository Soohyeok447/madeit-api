import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerInvalidException implements SwaggerServerException {
  @ApiProperty({
    description: '메시지',
    example: '유효하지 않은 카카오 토큰',
    examples: [
      '유효하지 않은 카카오 토큰',
      '유효하지 않은 구글 토큰',
      '유효하지 않은 provider query',
    ],
  })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 400 })
  public statusCode: number;

  @ApiProperty({ description: '에러종류', example: 'Bad Request' })
  public error: string;
}
