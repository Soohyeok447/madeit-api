import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DoUserOnboardingRequestDto {
  @ApiProperty({
    description: '유저 이름',
    example: '삼다삼다수',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: '유저 나이',
    example: 33,
  })
  @IsNumber()
  age: number;

  @ApiProperty({
    description: '목표',
    example: '나는 해적왕이 될거야! ONEPIECE 매일 한 권씩 읽기',
  })
  @IsString()
  @IsOptional()
  goal: string;

  @ApiProperty({
    description: '상태메시지',
    example: '이게 필요할까요? 좀 써봅시다',
  })
  @IsString()
  @IsOptional()
  statusMessage: string;
}
