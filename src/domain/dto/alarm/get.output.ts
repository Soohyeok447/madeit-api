import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Alarm } from 'src/domain/models/alarm.model';
import { Day } from 'src/domain/models/enum/day.enum';

export class GetOutput {
  @ApiProperty({ description: '알람 id' })
  alarmId: string;

  @ApiProperty({ description: '루틴 id' })
  routineId: string;

  @ApiProperty({ description: '알람 라벨' })
  label: string;

  @ApiProperty({ description: '알람 시간' })
  time: number;

  @ApiProperty({
    description: '알람 설정된 요일들',
    enum: Day,
    isArray: true,
    enumName: 'Day',
  })
  day: Day[];

  @ApiProperty({ description: '루틴 이름' })
  routineName: string;
}
