import { ApiProperty } from '@nestjs/swagger';

export class CountUsersAddedOneRoutineResponseDto {
  @ApiProperty({
    description: `
      알람`,
    example: 31,
  })
  public readonly TBD: number;
}
