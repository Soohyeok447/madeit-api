import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerAlarmConflictException implements SwaggerServerException {
  @ApiProperty({
    description: '메시지',
    example: `["Monday", "Tuesday"] 1300 중복`,
  })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 409 })
  public statusCode: number;

  @ApiProperty({ description: '에러종류', example: 'Conflict' })
  public error: string;
}
