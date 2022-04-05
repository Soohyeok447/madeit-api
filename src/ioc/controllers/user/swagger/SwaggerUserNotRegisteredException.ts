import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerUserNotRegisteredException
  implements SwaggerServerException
{
  @ApiProperty({ description: '메시지', example: '유저 등록이 필요함' })
  public readonly message: string;

  @ApiProperty({ description: '에러코드', example: 1 })
  public readonly errorCode: number;
}
