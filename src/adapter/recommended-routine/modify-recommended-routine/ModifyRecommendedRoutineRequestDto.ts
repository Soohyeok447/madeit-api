import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../../../domain/common/enums/Category';
import { FixedField } from '../../../domain/common/enums/FixedField';

export class ModifyRecommendedRoutineRequestDto {
  @ApiProperty({
    description: `
    추천 루틴 제목`,
    example: '이른 아침 기상',
  })
  @IsString()
  @IsOptional()
  public readonly title?: string;

  @ApiProperty({
    description: `
    추천 루틴 카테고리`,
    example: 'Health',
    enum: Category,
  })
  @IsEnum(Category)
  @IsOptional()
  public readonly category?: Category;

  @ApiProperty({
    description: `
    추천 루틴의 설명`,
    example:
      '게으름 탈출을 위해 1순위로 해야 할 것은 바로 이른 시간에 기상하는 것이 아닐까요?',
  })
  @IsString()
  @IsOptional()
  public readonly introduction?: string;

  @ApiProperty({
    description: `
    추천 루틴의 고정 필드값 리스트`,
    example: [],
    enum: FixedField,
    isArray: true,
    nullable: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  public readonly fixedFields?: FixedField[];

  @ApiProperty({
    description: `
    알람 hour`,
    example: null,
    nullable: true,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  public readonly hour?: number;

  @ApiProperty({
    description: `
    알람 minute`,
    example: null,
    nullable: true,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  public readonly minute?: number;

  @ApiProperty({
    description: `
    알람 요일`,
    isArray: true,
    example: [],
    minLength: 0,
    maxLength: 7,
    nullable: true,
    required: false,
  })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(7)
  @IsOptional()
  public readonly days?: number[];

  @ApiProperty({
    description: `
    알람 video id`,
    example: null,
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly alarmVideoId?: string;

  @ApiProperty({
    description: `
    루틴 video id`,
    example: null,
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly contentVideoId?: string;

  @ApiProperty({
    description: `
    루틴 타이머 second`,
    example: 300,
    nullable: true,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  public readonly timerDuration?: number;

  @ApiProperty({
    description: `
    가격`,
    example: 0,
    nullable: true,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  public readonly price?: number;

  @ApiProperty({
    description: `
    포인트`,
    example: 100,
    nullable: true,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  public readonly point?: number;

  @ApiProperty({
    description: `
    경험치`,
    example: 100,
    nullable: true,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  public readonly exp?: number;
}
