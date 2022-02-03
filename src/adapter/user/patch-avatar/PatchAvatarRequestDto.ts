import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Gender } from 'src/domain/enums/Gender';
import { Job } from 'src/domain/enums/Job';

export class PatchAvatarRequestDto {
  @ApiProperty({
    description: `
    유저 아바타 이미지`,
    type: 'string',
    format: 'binary',
    required: false,
  })
  avatar: any; 
}
