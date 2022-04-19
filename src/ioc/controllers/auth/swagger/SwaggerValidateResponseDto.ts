import { ApiProperty } from '@nestjs/swagger';

export class SwaggerValidateResponseDto {
  @ApiProperty({
    description: 'validation 결과',
    example: false,
  })
  public readonly result: boolean;
}
