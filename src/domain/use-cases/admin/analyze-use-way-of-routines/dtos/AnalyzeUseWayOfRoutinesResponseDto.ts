import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeUseWayOfRoutinesResponseDto {
  @ApiProperty({
    description: `
      알람`,
    example: 31,
  })
  public readonly TBD: number;
}
