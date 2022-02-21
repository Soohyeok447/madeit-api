import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ModifyUserRequestDto {
  @ApiProperty({
    description: '유저 이름',
    example: '수정테스트',
    required: false,
  })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({
    description: '유저 나이',
    example: 33,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  age: number;

  @ApiProperty({
    description: '목표',
    example: '목표가 수정됐지만 너희에게 알려주진 않을거야',
    required: false,
  })
  @IsOptional()
  @IsString()
  goal: string;

  @ApiProperty({
    description: '상태 메시지',
    example: '내 상태도 변했지만 알려주기 싫어',
    required: false,
  })
  @IsOptional()
  @IsString()
  statusMessage: string;
}
