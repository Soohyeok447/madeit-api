import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerInvalidUsernameException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '유효하지 않은 닉네임' })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 400 })
  public statusCode: number;

  @ApiProperty({ description: '에러종류', example: 'Bad Request' })
  public error: string;
}
