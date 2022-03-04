import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerUserNotFoundException implements SwaggerServerException {
  @ApiProperty({
    description: '메시지',
    example: '유저를 찾을 수 없음',
  })
  public message: string;

  @ApiProperty({ description: '에러코드', example: 70 })
  public errorCode: number;
}
