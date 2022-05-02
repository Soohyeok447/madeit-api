import { ApiProperty } from '@nestjs/swagger';
import { AlarmType } from '../../../common/types/AlarmType';
import { FixedField } from '../../../common/enums/FixedField';
/**
 * addRoutine, modifyRoutine, getRoutine, getRoutines
 * activationRoutine, inactivationRoutine
 * 에 사용되는 공통 ResponseDto입니다.
 */
export class CommonRoutineResponseDto {
  @ApiProperty({
    description: `
    루틴 id`,
    example: '61f689d5fb44d01fd1cb3348',
  })
  public readonly id: string;

  @ApiProperty({
    description: `
    루틴 제목`,
    example: '아침 기상',
  })
  public readonly title: string;

  @ApiProperty({
    description: `
    알람 hour`,
    example: 14,
  })
  public readonly hour: number;

  @ApiProperty({
    description: `
    알람 minute`,
    example: 30,
  })
  public readonly minute: number;

  @ApiProperty({
    description: `
    알람 요일`,
    isArray: true,
    example: [1, 3, 5, 7],
  })
  public readonly days: number[];

  @ApiProperty({
    description: `
    알람 video id`,
    example: 'youtube id가 올 예정',
    nullable: true,
  })
  public readonly alarmVideoId?: string;

  @ApiProperty({
    description: `
    알람 타입 (Youtube, Vibration)`,
    example: 'Vibration',
    nullable: true,
  })
  public readonly alarmType?: AlarmType;

  @ApiProperty({
    description: `
    루틴 video id`,
    example: 'youtube id가 올 예정',
    nullable: true,
  })
  public readonly contentVideoId?: string;

  @ApiProperty({
    description: `
    루틴 타이머 second`,
    example: 3000,
    nullable: true,
  })
  public readonly timerDuration?: number;

  @ApiProperty({
    description: `
    루틴 활성화 여부`,
    example: true,
  })
  public readonly activation: boolean;

  @ApiProperty({
    description: `
    추천 루틴의 고정 필드값 리스트`,
    example: ['Title', 'TimerDuration'],
    enum: FixedField,
    isArray: true,
  })
  public readonly fixedFields: FixedField[];

  @ApiProperty({
    description: `
    루틴 완료 시 유저가 받게 될 포인트`,
    example: 100,
  })
  public readonly point: number;

  @ApiProperty({
    description: `
    루틴 완료 시 유저가 받게 될 경험치`,
    example: 100,
  })
  public readonly exp: number;
}
