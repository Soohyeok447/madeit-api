import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AlarmType } from '../../../domain/common/types/AlarmType';

export class AddRoutineRequestDto {
  @ApiProperty({
    description: `
    루틴 제목`,
    example: '아침 기상',
  })
  @IsString()
  public readonly title: string;

  @ApiProperty({
    description: `
    알람 hour`,
    example: 9,
  })
  @IsNumber()
  public readonly hour: number;

  @ApiProperty({
    description: `
    알람 minute`,
    example: 0,
  })
  @IsNumber()
  public readonly minute: number;

  @ApiProperty({
    description: `
    알람 요일`,
    isArray: true,
    example: [1, 2, 3, 4, 5],
    minLength: 1,
    maxLength: 7,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  public readonly days: number[];

  @ApiProperty({
    description: `
    알람 video id`,
    example: 'youtube id가 올 예정',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  public readonly alarmVideoId?: string;

  @ApiProperty({
    description: `
    알람 타입 (Youtube, Vibration)`,
    example: 'Vibration',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  public readonly alarmType?: AlarmType;

  @ApiProperty({
    description: `
    루틴 video id`,
    example: 'youtube id가 올 예정',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  public readonly contentVideoId?: string;

  @ApiProperty({
    description: `
    루틴 타이머 second`,
    example: 3000,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  public readonly timerDuration?: number;

  @ApiProperty({
    description: `
    추천루틴 id`,
    example: '622f1116be523d43fc465916',
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly recommendedRoutineId?: string;
}
