import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeRoutinesUsageResponseDto {
  @ApiProperty({
    description: `
      알람`,
    example: 31,
  })
  public readonly TBD: number;
}
