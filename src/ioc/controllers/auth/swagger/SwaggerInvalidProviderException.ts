import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerInvalidProviderException implements SwaggerServerException {
  @ApiProperty({
    description: '메시지',
    example: '유효하지 않은 provider query',
  })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 1 })
  public errorCode: number;
}
