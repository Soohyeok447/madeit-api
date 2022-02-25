import { ApiProperty } from '@nestjs/swagger';

export class GetRoutinesResponseDto {
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
    example: 14
  })
  hour: number;

  @ApiProperty({
    description: `
    알람 minute`,
    example: 30
  })
  minute: number;

  @ApiProperty({
    description: `
    알람 요일`,
    isArray: true,
    example: "주말",
  })
  days: number[];

  @ApiProperty({
    description: `
    알람 video id`,
    example: 'youtube id가 올 예정',
    nullable: true
  })
  alarmVideoId?: string;

  @ApiProperty({
    description: `
    루틴 video id`,
    example: 'youtube id가 올 예정',
    nullable: true
  })
  contentVideoId?: string;

  @ApiProperty({
    description: `
    루틴 타이머 second`,
    example: 3000,
    nullable: true
  })
  timerDuration?: number;

  @ApiProperty({
    description: `
    루틴 활성화 여부`,
    example: true,
  })
  activation: boolean;

  @ApiProperty({
    description: `
    루틴 실행 시 까지 남은 시간`,
    example: 4217812,
  })
  timeToRunAlarm: number;
}
