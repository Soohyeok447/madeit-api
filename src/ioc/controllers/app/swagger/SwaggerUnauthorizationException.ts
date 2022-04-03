import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerUnauthorizationException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '토큰 만료' })
  public readonly message: string;

  @ApiProperty({ description: '상태코드', example: 80 })
  public readonly errorCode: number;
}
