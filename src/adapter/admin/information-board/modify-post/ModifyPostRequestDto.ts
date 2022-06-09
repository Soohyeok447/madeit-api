import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ModifyPostRequestDto {
  @ApiProperty({
    description: `
      게시판 제목`,
    example: '루틴이야기',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  public readonly title?: string;
}
