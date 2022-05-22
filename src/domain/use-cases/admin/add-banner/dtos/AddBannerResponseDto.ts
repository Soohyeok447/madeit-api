import { ApiProperty } from '@nestjs/swagger';

export class AddBannerResponseDto {
  @ApiProperty({
    description: `
      타이틀`,
    example: '니들이 뭔데 내 한계를 정하냐',
  })
  public readonly title: string;

  @ApiProperty({
    description: `
      조회수`,
    example: 2301,
  })
  public readonly views: number;

  @ApiProperty({
    description: `
      배너 이미지 url`,
    example:
      'https://d3tkmy2rdsgocy.cloudfront.net/origin/avatar/c2384fdc-2bcd-4a6f-a21b-ce2b471cc644',
  })
  public readonly bannerImageUrl: string;

  @ApiProperty({
    description: `
    유튜브 영상 id`,
    example: '6ChKKX4EyqM',
  })
  public readonly contentVideoId: string;
}