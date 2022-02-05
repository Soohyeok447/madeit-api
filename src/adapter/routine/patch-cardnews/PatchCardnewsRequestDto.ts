import { ApiProperty } from '@nestjs/swagger';

export class PatchCardnewsRequestDto {
  @ApiProperty({
    description: '카드뉴스 이미지',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  cardnews: any;
}
