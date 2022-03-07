import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty({ 
    description: 'thirdPartyAccessToken',
    example: 'fdasdfs0dsfa89udfsa987iq234ruir32kjefuiofaewuiofei7yfriyf3q2iuoyhq32fhuioq23fuhq23fhkujfq32jkha3ef'
  })
  @IsString()
  thirdPartyAccessToken: string;

  @ApiProperty({
    description: '유저 이름',
    example: '삼다삼다수',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: '유저 나이',
    example: 56,
  })
  @IsNumber()
  age: number;

  @ApiProperty({
    description: '목표',
    example: '안산시 상록구 갑 국회의원 당선',
  })
  @IsString()
  @IsOptional()
  goal: string;

  @ApiProperty({
    description: '상태메시지',
    example: '바빠서 루틴할 시간이 없어여',
  })
  @IsString()
  @IsOptional()
  statusMessage: string;
}
