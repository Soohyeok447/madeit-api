import { ApiProperty } from '@nestjs/swagger';

export class AddImageByUserResponseDto {
  @ApiProperty({
    description: `
    DB에 저장된 이미지 id`,
    example: '626eabc05c3bccf26ad0e8b1',
  })
  public readonly id: string;
}
