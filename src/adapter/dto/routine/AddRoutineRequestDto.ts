import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from 'src/domain/enums/Category';
import { RoutineType } from 'src/domain/enums/RoutineType';

export class AddRoutineRequestDto {
  @ApiProperty({ description: '루틴 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '카테고리', enum: Category })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({
    description: '루틴 타입',
    enum: RoutineType,
  })
  @IsEnum(RoutineType)
  type: RoutineType;

  @ApiProperty({ description: '루틴 설명 스크립트' })
  @IsString()
  introductionScript: string;

  @ApiProperty({ description: '루틴과 관련된 동기부여 문장' })
  @IsString()
  motivation: string;

  @ApiProperty({ description: '루틴 가격' })
  @IsNumberString() //TODO IsNumber로 수정
  price: number;

  @ApiProperty({ description: '루틴과 관련된 상품들의 id' })
  @IsArray()
  @IsOptional()
  relatedProducts?: string[];

  @ApiProperty({
    description: '썸네일 이미지',
    type: 'string',
    format: 'binary',
  })
  thumbnail: any;

  @ApiProperty({
    description: '카드뉴스 이미지',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  cardnews: any;
}
