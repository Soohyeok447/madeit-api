import { ApiProperty } from '@nestjs/swagger';

export class PatchAvatarResponseDto {
  @ApiProperty({
    description: '유저 이름',
    example: '테스트',
  })
  public readonly username: string;

  @ApiProperty({
    description: '유저 나이',
    example: 33,
  })
  public readonly age: number;

  @ApiProperty({
    description: '목표',
    example: '다리찢기 1자',
  })
  public readonly goal: string;

  @ApiProperty({
    description: '상태 메시지',
    example: 'im so high',
  })
  public readonly statusMessage: string;

  @ApiProperty({
    description: '프로필 이미지',
    example:
      'http://d28okinpr57gbg.cloudfront.net/profile/f3a3e741-a0db-41db-8ca3-ebf4e9aa0348',
  })
  public readonly avatar: string;
}
