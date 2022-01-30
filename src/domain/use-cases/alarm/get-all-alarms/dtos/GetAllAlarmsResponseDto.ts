import { ApiProperty } from '@nestjs/swagger';
import { Day } from 'src/domain/enums/Day';

export class GetAllAlarmsResponseDto {
  @ApiProperty({
    description: `
      알람 id`,
    example: '61f28d9b1ead82c6e3db36c8'
  })
  alarmId: string;

  @ApiProperty({
    description: `
      루틴 id`,
    example: '61f28d9b1ead82c6e3db36c8'
  })
  routineId: string;

  @ApiProperty({
    description: `
      알람 라벨`,
    example: '아찔아찔해 필굿'
  })
  label: string;

  @ApiProperty({
    description: `
      알람 시간`,
    example: '2359'
  })
  time: string;

  @ApiProperty({
    description: '알람 설정된 요일들',
    enum: Day,
    isArray: true,
    enumName: 'Day',
    example: [Day.Wednesday, Day.Saturday]
  })
  day: Day[];

  // @ApiProperty({
  //   description: `
  //     루틴 이름`,
  // })
  // routineName: string; //TODO 삭제
}
