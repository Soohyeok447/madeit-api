import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerUserNotAdminException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: 'UserNotAdminException' })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 73 })
  public errorCode: number;
}
