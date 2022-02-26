import { ApiProperty } from '@nestjs/swagger';

export class RoutineModel {
  @ApiProperty({ description: '루틴 id' })
  id: string;

  @ApiProperty({ description: '루틴 제목' })
  title: string;

  @ApiProperty({ description: '루틴 알람 hour' })
  hour: number;

  @ApiProperty({ description: '루틴 알람 minute' })
  minute: number;

  @ApiProperty({
    description: '루틴 알람 요일',
    isArray: true,
    type: Number
  })
  days: number[];

  @ApiProperty({ description: '알람 유튜브 주소' })
  alarmVideoId: string;

  @ApiProperty({ description: '루틴 유튜브 주소' })
  contentVideoId: string;

  @ApiProperty({ description: '루틴 진행중인 시간' })
  timerDuration: number;

  @ApiProperty({ description: '알람 활성화 여부' })
  activation: boolean;
}
