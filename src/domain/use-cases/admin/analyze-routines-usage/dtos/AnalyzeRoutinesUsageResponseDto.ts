import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeRoutinesUsageResponseDto {
  @ApiProperty({
    description: `
      (ISO datetime) 분석 기준 날짜`,
    example: '2022-02-04T22:44:30.652Z',
  })
  public readonly startDate: string;

  @ApiProperty({
    description: `
      일주일간 유저당 평균 루틴 생성 수`,
    example: 11.325,
  })
  public readonly value: number;
}
