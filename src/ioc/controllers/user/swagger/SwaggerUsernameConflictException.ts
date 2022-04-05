import { ApiProperty } from '@nestjs/swagger';
import { SwaggerServerException } from '../../SwaggerExceptions';

export class SwaggerUsernameConflictException
  implements SwaggerServerException
{
  @ApiProperty({ description: '메시지', example: '중복된 닉네임' })
  public readonly message: string;

  @ApiProperty({ description: '에러종류', example: 2 })
  public readonly errorCode: number;
}
