import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerUserNotAdminException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '어드민이 아님' })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 401 })
  public statusCode: number;

  @ApiProperty({ description: '에러종류', example: 'Unauthorized' })
  public error: string;
}
