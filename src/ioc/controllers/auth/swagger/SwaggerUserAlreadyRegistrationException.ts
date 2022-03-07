import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerUserAlreadyRegistrationException implements SwaggerServerException {
  @ApiProperty({
    description: '메시지',
    example: '유저가 이미 가입 됨',
  })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 7 })
  public errorCode: number;
}
