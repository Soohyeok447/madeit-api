import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PatchAvatarRequestDtoV2 {
  @ApiProperty({
    description: `
    유저 아바타 이미지Id`,
    type: 'string',
  })
  @IsString()
  public readonly avatarId: string;
}
