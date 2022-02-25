import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddRoutineRequestDto {
  @ApiProperty({
    description: `
    루틴 제목`,
    example: '아침 기상',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: `
    알람 hour`,
    example: 9
  })
  @IsNumber()
  hour: number;

  @ApiProperty({
    description: `
    알람 minute`,
    example: 0
  })
  @IsNumber()
  minute: number;

  @ApiProperty({
    description: `
    알람 요일`,
    isArray: true,
    example: [1, 2, 3, 4, 5],
    minLength: 1,
    maxLength: 7
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  days: number[];

  @ApiProperty({
    description: `
    알람 video id`,
    example: 'youtube id가 올 예정',
    nullable: true
  })
  @IsString()
  @IsOptional()
  alarmVideoId?: string;

  @ApiProperty({
    description: `
    루틴 video id`,
    example: 'youtube id가 올 예정',
    nullable: true
  })
  @IsString()
  @IsOptional()
  contentVideoId?: string;


  @ApiProperty({
    description: `
    루틴 타이머 second`,
    example: 3000,
    nullable: true
  })
  @IsNumber()
  @IsOptional()
  timerDuration?: number;
}
