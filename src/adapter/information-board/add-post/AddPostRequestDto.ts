import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddPostRequestDto {
  @ApiProperty({
    description: `
      게시판 제목`,
    example: '루틴이야기',
  })
  @IsString()
  public readonly title: string;
}
