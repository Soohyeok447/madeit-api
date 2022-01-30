import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Day } from 'src/domain/enums/Day';

export class UpdateAlarmRequestDto {
  @ApiProperty({
    description: `
    알람 라벨`,
    nullable: true,
    example: '동물농장 시청준비'
  })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty({
    description: `
    알람 시간
    ex) 오후 1시 -> 1300`,
    example: '0059',
  })
  @IsString()
  time: string;

  @ApiProperty({
    description: `
    요일`,
    isArray: true,
    enum: Day,
    enumName: 'Day',
    example: [Day.Sunday]
  })
  @IsEnum(Day, { each: true })
  day: Day[];

  @ApiProperty({
    description: `
    루틴id`,
    example: '61f28d9b1ead82c6e3db36c8'
  })
  @IsString()
  routineId: string;
}
