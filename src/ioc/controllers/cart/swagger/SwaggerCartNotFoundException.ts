import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerCartNotFoundException implements SwaggerServerException {
  @ApiProperty({
    description: '메시지',
    example: 'cartId로 해당 카트 Object를 찾지 못함',
  })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 74 })
  public errorCode: number;
}
