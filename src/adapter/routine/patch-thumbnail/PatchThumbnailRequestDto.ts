import { ApiProperty } from '@nestjs/swagger';

export class PatchThumbnailRequestDto {
  @ApiProperty({
    description: '썸네일 이미지',
    type: 'string',
    format: 'binary',
  })
  thumbnail: any;
}
