import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { RoutineType } from 'src/domain/models/enum/routine_type.enum';

export class AddRoutineRequest {
  @ApiProperty({ description: '어드민 토큰'})
  @IsString()
  secret: string;

  @ApiProperty({ description: '루틴 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '루틴 타입', enum: RoutineType, enumName: 'RoutineType' })
  @IsEnum(RoutineType)
  type: RoutineType;

  @ApiProperty({ description: '루틴 썸네일 주소' })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({ description: '루틴 설명 스크립트' })
  @IsString()
  introductionScript: string;

  @ApiProperty({ description: '루틴 소개이미지 주소' })
  @IsString()
  introductionImageUrl: string;
  
  @ApiProperty({ description: '루틴과 관련된 동기부여 문장' })
  @IsString()
  motivation: string;
  
  @ApiProperty({ description: '루틴 가격' })
  @IsNumber()
  price: number;
  
  @ApiProperty({ description: '루틴과 관련된 상품들의 id' })
  @IsArray()
  relatedProducts?: string[];

}
