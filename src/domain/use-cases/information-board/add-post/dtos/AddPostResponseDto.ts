import { ApiProperty } from '@nestjs/swagger';

export class AddPostResponseDto {
  @ApiProperty({
    description: `
    정보게시판 게시글 id`,
    example: '61f689d5fb44d01fd1cb3348',
  })
  public readonly id: string;

  @ApiProperty({
    description: `
    정보게시판 게시글 제목`,
    example: '제프베조스의 아침습관',
  })
  public readonly title: string;

  @ApiProperty({
    description: `
    정보게시판 게시글 조회수`,
    example: 0,
  })
  public readonly views: number;

  // @ApiProperty({
  //   description: `
  //   정보게시판 게시글의 카드뉴스`,
  //   example: ['url1, url2'],
  // })
  // readonly cardnews: string[];
}
