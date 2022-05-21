import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddBannerRequestDto {
  @ApiProperty({
    description: `
      배너 제목`,
    example: '니들이 뭔데 내 한계를 정하냐',
  })
  @IsString()
  public readonly title: string;

  @ApiProperty({
    description: `
      DB에 저장된 배너 이미지 id`,
    example: '626eabc05c3bccf26ad0e8b1',
  })
  @IsString()
  public readonly bannerImageId: string;

  @ApiProperty({
    description: `
      유튜브 id`,
    example: '02GLhppUhZU',
  })
  @IsString()
  public readonly contentVideoId: string;
}
