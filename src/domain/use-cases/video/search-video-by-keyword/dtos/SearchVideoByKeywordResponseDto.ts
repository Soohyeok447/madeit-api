import { ApiProperty } from "@nestjs/swagger";


class Items {
  @ApiProperty({
    description: `
    영상 id`,
    example: 'YRCxIl98b3w',
  })
  videoId: string;

  @ApiProperty({
    description: `
    영상 제목`,
    example: '울브스 팬들이 황희찬 사랑할 수밖에 없는 이유 #SPORTSTIME',
  })
  title: string;

  @ApiProperty({
    description: `
    영상 썸네일 url`,
    example: 'https://i.ytimg.com/vi/YRCxIl98b3w/hqdefault.jpg',
  })
  thumbnail: string;

  @ApiProperty({
    description: `
    영상 길이`,
    example: '4:37',
  })
  duration: string;
}


export class SearchVideoByKeywordResponseDto {
  @ApiProperty({
    description: `
    다음 페이지 토큰`,
    example: 'CAoQAA',
  })
  nextpageToken: string;

  @ApiProperty({
    description: `
    youtube item list`,
    type: Items,
    isArray: true
  })
  items: Items[];
}