import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../../../common/enums/Category';
import { FixedField } from '../../../../common/enums/FixedField';

export class ModifyRecommendedRoutineResponseDto {
  @ApiProperty({
    description: `
    추천 루틴 id`,
    example: '621a69aade24891627ff5739',
  })
  id: string;

  @ApiProperty({
    description: `
    추천 루틴 제목`,
    example: '이른 아침 기상',
  })
  title: string;

  @ApiProperty({
    description: `
    추천 루틴 카테고리`,
    example: 'Health',
    enum: Category,
  })
  category: Category;

  @ApiProperty({
    description: `
    추천 루틴의 설명`,
    example:
      '게으름 탈출을 위해 1순위로 해야 할 것은 바로 이른 시간에 기상하는 것이 아닐까요?',
  })
  introduction: string;

  @ApiProperty({
    description: `
    추천 루틴의 고정 필드값 리스트`,
    example: [],
    enum: FixedField,
    isArray: true,
    nullable: true,
    required: false,
  })
  fixedFields: FixedField[];

  @ApiProperty({
    description: `
    알람 hour`,
    example: null,
    nullable: true,
    required: false,
  })
  hour: number;

  @ApiProperty({
    description: `
    알람 minute`,
    example: null,
    nullable: true,
    required: false,
  })
  minute: number;

  @ApiProperty({
    description: `
    알람 요일`,
    isArray: true,
    example: [],
    minLength: 1,
    maxLength: 7,
    nullable: true,
    required: false,
  })
  days: number[];

  @ApiProperty({
    description: `
    알람 video id`,
    example: null,
    nullable: true,
    required: false,
  })
  alarmVideoId?: string;

  @ApiProperty({
    description: `
    루틴 video id`,
    example: null,
    nullable: true,
    required: false,
  })
  contentVideoId?: string;

  @ApiProperty({
    description: `
    루틴 타이머 second`,
    example: 300,
    nullable: true,
    required: false,
  })
  timerDuration?: number;

  @ApiProperty({
    description: `
    추천 루틴 가격`,
    example: 0,
    nullable: true,
    required: false,
  })
  price?: number;

  @ApiProperty({
    description: `
    추천 루틴 카드뉴스 url 리스트`,
    example: ['url', 'url'],
    nullable: true,
    required: false,
    isArray: true,
  })
  cardnews?: string[];

  @ApiProperty({
    description: `
    추천 루틴 썸네일 url`,
    example: 'url',
    nullable: true,
    required: false,
  })
  thumbnail?: string;

  @ApiProperty({
    description: `
    추천 루틴 포인트`,
    example: 0,
  })
  point: number;

  @ApiProperty({
    description: `
    추천 루틴 경험치`,
    example: 0,
    nullable: true,
    required: false,
  })
  exp: number;
}
