import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  isArray,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../../../domain/enums/Category';
import { FixedField } from '../../../domain/enums/FixedField';

export class AddRecommendedRoutineRequestDto {
  @ApiProperty({
    description: `
    추천 루틴 제목`,
    example: '아침 기상',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: `
    추천 루틴 카테고리`,
    example: 'Health',
    enum: Category
  })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({
    description: `
    추천 루틴의 설명`,
    example: '게으름 탈출을 위해 1순위로 해야 할 것은 바로 이른 시간에 기상하는 것이 아닐까요?',
  })
  @IsString()
  introduction: string;

  @ApiProperty({
    description: `
    추천 루틴의 고정 필드값 리스트`,
    example: ['Title', 'TimerDuration'],
    enum: FixedField,
    isArray: true,
    nullable: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  fixedFields: FixedField[];

  @ApiProperty({
    description: `
    알람 hour`,
    example: 9,
    nullable: true,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  hour: number;

  @ApiProperty({
    description: `
    알람 minute`,
    example: 0,
    nullable: true,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  minute: number;

  @ApiProperty({
    description: `
    알람 요일`,
    isArray: true,
    example: [1, 2, 3, 4, 5],
    minLength: 1,
    maxLength: 7,
    nullable: true,
    required: false,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsOptional()
  days: number[];

  @ApiProperty({
    description: `
    알람 video id`,
    example: null,
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  alarmVideoId?: string;

  @ApiProperty({
    description: `
    루틴 video id`,
    example: 'youtube id가 올 예정',
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  contentVideoId?: string;


  @ApiProperty({
    description: `
    루틴 타이머 second`,
    example: null,
    nullable: true,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  timerDuration?: number;
}
