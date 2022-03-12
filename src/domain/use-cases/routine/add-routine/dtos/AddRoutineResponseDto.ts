import { ApiProperty } from '@nestjs/swagger';
import { FixedField } from '../../../../enums/FixedField';

export class AddRoutineResponseDto {
  @ApiProperty({
    description: `
    루틴 id`,
    example: '61f689d5fb44d01fd1cb3348',
  })
  id: string;

  @ApiProperty({
    description: `
    루틴 제목`,
    example: '아침 기상',
  })
  title: string;

  @ApiProperty({
    description: `
    알람 hour`,
    example: 9,
  })
  hour: number;

  @ApiProperty({
    description: `
    알람 minute`,
    example: 0,
  })
  minute: number;

  @ApiProperty({
    description: `
    알람 요일`,
    isArray: true,
    example: [1, 2, 3, 4, 5],
  })
  days: number[];

  @ApiProperty({
    description: `
    알람 video id`,
    example: 'youtube id가 올 예정',
    nullable: true,
  })
  alarmVideoId?: string;

  @ApiProperty({
    description: `
    루틴 video id`,
    example: 'youtube id가 올 예정',
    nullable: true,
  })
  contentVideoId?: string;

  @ApiProperty({
    description: `
    루틴 타이머 second`,
    example: 3000,
    nullable: true,
  })
  timerDuration?: number;

  @ApiProperty({
    description: `
    루틴 활성화 여부`,
    example: false,
  })
  activation: boolean;

  @ApiProperty({
    description: `
    추천 루틴의 고정 필드값 리스트`,
    example: ['Title', 'TimerDuration'],
    enum: FixedField,
    isArray: true,
  })
  fixedFields: FixedField[];

  @ApiProperty({
    description: `
    루틴 완료 시 유저가 받게 될 포인트`,
    example: 100,
  })
  point: number;

  @ApiProperty({
    description: `
    루틴 완료 시 유저가 받게 될 경험치`,
    example: 100,
  })
  exp: number;
}
