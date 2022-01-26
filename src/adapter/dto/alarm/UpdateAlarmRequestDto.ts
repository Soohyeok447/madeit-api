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
  @ApiProperty({ description: '알람 라벨', nullable: true })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty({ description: '알람 시간 <br/> ex) 오후 1시 -> 1300' })
  @IsNumber()
  time: number;

  @ApiProperty({
    description: '요일',
    isArray: true,
    enum: Day,
    enumName: 'Day',
  })
  @IsEnum(Day, { each: true })
  day: Day[];

  @ApiProperty({ description: '루틴id' })
  @IsString()
  routineId: string;
}
