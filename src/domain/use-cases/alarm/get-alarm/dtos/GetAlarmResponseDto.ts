import { ApiProperty } from '@nestjs/swagger';
import { Day } from 'src/domain/enums/Day';

export class GetAlarmResponseDto {
  @ApiProperty({
    description: '알람 id',
    example: '61f291df1ead82c6e3db36ea'
  })
  alarmId: string;

  @ApiProperty({
    description: '루틴 id',
    example: '61f28d9b1ead82c6e3db36c8'
  })
  routineId: string;

  @ApiProperty({
    description: '알람 라벨',
    example: '서프라이즈 시청'
  })
  label: string;

  @ApiProperty({
    description: '알람 시간',
    example: '1200'
  })
  time: string;

  @ApiProperty({
    description: '알람 설정된 요일들',
    enum: Day,
    isArray: true,
    enumName: 'Day',
    example: [Day.Sunday]
  })
  day: Day[];

  // @ApiProperty({
  //   description: '루틴 이름'
  // })
  // routineName: string; //TODO 최소한의 것을 제공해라 삭제
}
