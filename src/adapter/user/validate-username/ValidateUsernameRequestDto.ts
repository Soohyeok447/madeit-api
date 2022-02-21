import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateUsernameRequestDto {
  @ApiProperty({
    description: '유저 이름',
    example: '유효성검사',
    required: true,
  })
  @IsString()
  username: string;
}
