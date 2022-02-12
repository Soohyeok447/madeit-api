import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../../../domain/enums/Category';
import { RoutineType } from '../../../domain/enums/RoutineType';

export class ModifyRoutineRequestDto {
  // @ApiProperty({ description: '루틴 id' })
  // @IsString()
  // routineId: string;

  @ApiProperty({
    description: '루틴 이름',
    example: '오바마 따라잡기',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '카테고리',
    enum: Category,
    example: Category.Health,
    required: false,
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiProperty({
    description: '루틴 타입',
    enum: RoutineType,
    example: RoutineType.Embeded,
    required: false,
  })
  @IsOptional()
  @IsEnum(RoutineType)
  type?: RoutineType;

  @ApiProperty({
    description: '루틴 설명 스크립트',
    example:
      '버락 오바마 전 미국 대통령은 백악관 집무실로 출근하기 전에 웨이트트레이닝과 유산소 운동을 했습니다',
    required: false,
  })
  @IsOptional()
  @IsString()
  introductionScript?: string;

  @ApiProperty({
    description: '루틴과 관련된 동기부여 문장',
    example: '갓등의 삶을 살아봅시다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  motivation?: string;

  @ApiProperty({
    description: '루틴 가격',
    example: 0,
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: '루틴과 관련된 상품들의 id',
    required: false,
    example: ['id', 'id'],
  })
  @IsArray()
  @IsOptional()
  relatedProducts?: string[];
}
