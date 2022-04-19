import { ApiProperty } from '@nestjs/swagger';

export class ValidateResponseDto {
  @ApiProperty({
    description: 'validation 결과',
    example: true,
  })
  public readonly result: boolean;
}
