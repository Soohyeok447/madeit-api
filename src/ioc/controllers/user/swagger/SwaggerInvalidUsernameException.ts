import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerInvalidUsernameException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '닉네임은 2자 이상 8자 이하여야 합니다' })
  public message: string;

  @ApiProperty({ description: '에러종류', example: 1 })
  public errorCode: number;
}
