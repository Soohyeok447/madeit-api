import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IssueAdminTokenRequestDto {
  @ApiProperty({
    description: `
      아이디`,
    example: 'adminTest',
  })
  @IsString()
  public readonly id: string;

  @ApiProperty({
    description: `
      비밀번호`,
    example: 'happyhappy',
  })
  @IsString()
  public readonly password: string;
}
