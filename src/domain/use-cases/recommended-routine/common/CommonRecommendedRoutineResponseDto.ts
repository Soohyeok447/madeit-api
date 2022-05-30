import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../../common/enums/Category';
import { FixedField } from '../../../common/enums/FixedField';

export class CommonRecommendedRoutineResponseDto {
  @ApiProperty({
    description: `
    추천 루틴 id`,
    example: '621a69aade24891627ff5739',
  })
  public readonly id: string;

  @ApiProperty({
    description: `
    추천 루틴 제목`,
    example: '아침 기상',
  })
  public readonly title: string;

  @ApiProperty({
    description: `
    추천 루틴 카테고리`,
    example: Category.Reading,
    enum: Category,
  })
  public readonly category: Category;

  @ApiProperty({
    description: `
    추천 루틴의 설명`,
    example:
      '게으름 탈출을 위해 1순위로 해야 할 것은 바로 이른 시간에 기상하는 것이 아닐까요?',
  })
  public readonly introduction: string;

  @ApiProperty({
    description: `
    추천 루틴의 고정 필드값 리스트`,
    example: ['Title', 'TimerDuration'],
    enum: FixedField,
    isArray: true,
    nullable: true,
    required: false,
  })
  public readonly fixedFields: FixedField[];

  @ApiProperty({
    description: `
    알람 hour`,
    example: 9,
    nullable: true,
    required: false,
  })
  public readonly hour: number;

  @ApiProperty({
    description: `
    알람 minute`,
    example: 0,
    nullable: true,
    required: false,
  })
  public readonly minute: number;

  @ApiProperty({
    description: `
    알람 요일`,
    isArray: true,
    example: null,
    minLength: 1,
    maxLength: 7,
    nullable: true,
    required: false,
  })
  public readonly days: number[];

  @ApiProperty({
    description: `
    알람 video id`,
    example: null,
    nullable: true,
    required: false,
  })
  public readonly alarmVideoId?: string;

  @ApiProperty({
    description: `
    루틴 video id`,
    example: 'youtube id가 올 예정',
    nullable: true,
    required: false,
  })
  public readonly contentVideoId?: string;

  @ApiProperty({
    description: `
    루틴 타이머 second`,
    example: null,
    nullable: true,
    required: false,
  })
  public readonly timerDuration?: number;

  @ApiProperty({
    description: `
    추천 루틴 가격`,
    example: 0,
    nullable: true,
    required: false,
  })
  public readonly price?: number;

  @ApiProperty({
    description: `
    추천 루틴 카드뉴스 url 리스트`,
    example: [null],
    nullable: true,
    required: false,
    isArray: true,
  })
  public readonly cardnewsUrl?: any;

  @ApiProperty({
    description: `
    추천 루틴 썸네일 url`,
    example: null,
    nullable: true,
    required: false,
  })
  public readonly thumbnailUrl?: any;

  @ApiProperty({
    description: `
    추천 루틴 포인트`,
    example: 0,
  })
  public readonly point: number;

  @ApiProperty({
    description: `
    추천 루틴 경험치`,
    example: 0,
  })
  public readonly exp: number;

  @ApiProperty({
    description: `
    루틴 인증하는 방법 스크립트`,
    example: `
    1. 헬스장이나 운동복을 찍은 사진을 찍습니다
    2. 루틴 실행화면 하단의 카메라 아이콘을 눌러서 인증해야만 인정됩니다
    3. 루틴 실행시간 내에 찍힌 사진만 인정됩니다
    `,
    nullable: true,
  })
  public readonly howToProveScript: string;

  @ApiProperty({
    description: `
    루틴 인증하는 방법 사진`,
    example: 'https://d28okinpr57gbg.cloudfront.net/how-to-prove/reading',
    nullable: true,
  })
  public readonly howToProveImageUrl: string;
}
