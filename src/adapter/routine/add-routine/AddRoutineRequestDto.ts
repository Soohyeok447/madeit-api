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
import { Category } from '../../../domain/enums/Category';
import { RoutineType } from '../../../domain/enums/RoutineType';

export class AddRoutineRequestDto {
  @ApiProperty({ description: '루틴 이름', example: '수혁쌤과 함께하는 요가클래스' })
  @IsString()
  name: string;

  @ApiProperty({ description: '카테고리', enum: Category, example: Category.Health }) //TODO 카테고리 ui보고 수정
  @IsEnum(Category)
  category: Category;

  @ApiProperty({
    description: '루틴 타입',
    enum: RoutineType,
    example: RoutineType.Embeded,
  })
  @IsEnum(RoutineType)
  type: RoutineType;

  @ApiProperty({ description: '루틴 설명 스크립트', example: '요가파이어' })
  @IsString()
  introductionScript: string;

  @ApiProperty({ description: '루틴과 관련된 동기부여 문장', example: '뻣뻣한 몸에 부드러움을 선사합시다' })
  @IsString()
  motivation: string;

  @ApiProperty({ description: '루틴 가격', example: 0 })
  @IsNumberString() //TODO IsNumber로 수정
  price: number;

  @ApiProperty({ description: '루틴과 관련된 상품들의 id', example: ['id가 올 예정'] })
  @IsArray()
  @IsOptional()
  relatedProducts?: string[];

  // @ApiProperty({
  //   description: '썸네일 이미지',
  //   type: 'string',
  //   format: 'binary',
  // })
  // thumbnail: any;

  // @ApiProperty({
  //   description: '카드뉴스 이미지',
  //   type: 'string',
  //   format: 'binary',
  //   isArray: true,
  // })
  // cardnews: any;
}
