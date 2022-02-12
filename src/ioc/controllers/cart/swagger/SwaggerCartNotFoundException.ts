import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerCartNotFoundException implements SwaggerServerException {
  @ApiProperty({
    description: '메시지',
    example: 'cartId로 해당 카트 Object를 찾지 못함',
  })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 404 })
  public statusCode: number;

  @ApiProperty({ description: '에러종류', example: 'Not Found' })
  public error: string;
}
