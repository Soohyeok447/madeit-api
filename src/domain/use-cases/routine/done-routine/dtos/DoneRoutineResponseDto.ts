import { ApiProperty } from '@nestjs/swagger';

export class DoneRoutineResponseDto {
  @ApiProperty({
    description: `
    루틴 id`,
    example: '61f689d5fb44d01fd1cb3348',
  })
  public readonly id: string;
}
