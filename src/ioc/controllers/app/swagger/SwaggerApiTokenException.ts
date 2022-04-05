import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerApiTokenException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '유효하지 않은 issuer' })
  public readonly message: string;

  @ApiProperty({ description: '상태코드', example: 90 })
  public readonly errorCode: number;
}
