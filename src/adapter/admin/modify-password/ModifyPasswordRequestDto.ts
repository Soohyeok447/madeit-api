import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ModifyPasswordRequestDto {
  @ApiProperty({
    description: `
      기존 비밀번호`,
    example: 'happyhappy',
  })
  @IsString()
  public readonly oldPassword: string;

  @ApiProperty({
    description: `
      새로운 비밀번호`,
    example: 'newhappyhappy',
  })
  @IsString()
  public readonly newPassword: string;
}
