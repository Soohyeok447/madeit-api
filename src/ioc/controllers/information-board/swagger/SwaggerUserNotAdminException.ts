import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerUserNotAdminException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '어드민이 아님' })
  public readonly message: string;

  @ApiProperty({ description: '에러코드', example: 73 })
  public readonly errorCode: number;
}
