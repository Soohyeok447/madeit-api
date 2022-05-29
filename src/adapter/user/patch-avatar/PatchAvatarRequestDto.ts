import { ApiProperty } from '@nestjs/swagger';

export class PatchAvatarRequestDto {
  @ApiProperty({
    description: `
    유저 아바타 이미지`,
    type: 'string',
    format: 'binary',
    required: false,
  })
  public readonly avatarId: any;
}
