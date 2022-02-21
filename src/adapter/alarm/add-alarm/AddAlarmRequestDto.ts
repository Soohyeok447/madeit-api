import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Day } from '../../../domain/enums/Day';

export class AddAlarmRequestDto {
  @ApiProperty({
    description: `
    알람 라벨`,
    nullable: true,
    example: '오전수업',
  })
  @IsString()
  @IsOptional()
  label: string;

  @ApiProperty({
    description: `
    알람 시간 
    ex) 오후 1시 -> 1300`,
    example: '0820',
  })
  @IsString()
  time: string;

  @ApiProperty({
    description: `
    요일`,
    isArray: true,
    enum: Day,
    enumName: 'Day',
    example: [Day.Monday, Day.Tuesday],
  })
  @IsEnum(Day, { each: true })
  days: Day[];

  @ApiProperty({
    description: '루틴id',
    example: '61f28d9b1ead82c6e3db36c8',
  })
  @IsString()
  @Length(24)
  routineId: string;
}
