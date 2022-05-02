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

export class ModifyRoutineRequestDto {
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
    example: 14,
  })
  @IsNumber()
  public readonly hour: number;

  @ApiProperty({
    description: `
    알람 minute`,
    example: 30,
  })
  @IsNumber()
  public readonly minute: number;

  @ApiProperty({
    description: `
    알람 요일`,
    isArray: true,
    example: [1, 3, 5, 7],
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
}
