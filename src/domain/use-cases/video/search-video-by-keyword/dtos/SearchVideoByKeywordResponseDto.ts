import { ApiProperty } from '@nestjs/swagger';

export class SearchVideoByKeywordResponseDto {
  @ApiProperty({
    description: `
    영상 id`,
    example: 'YRCxIl98b3w',
  })
  public readonly videoId: string;

  @ApiProperty({
    description: `
    영상 제목`,
    example: '울브스 팬들이 황희찬 사랑할 수밖에 없는 이유 #SPORTSTIME',
  })
  public readonly title: string;

  @ApiProperty({
    description: `
    영상 썸네일 url`,
    example: 'https://i.ytimg.com/vi/YRCxIl98b3w/hqdefault.jpg',
  })
  public readonly thumbnail: string;

  @ApiProperty({
    description: `
    채널 제목`,
    example: '스포츠타임',
  })
  public readonly channel: string;

  @ApiProperty({
    description: `
    영상 길이`,
    example: 277,
  })
  public readonly duration: number;
}
