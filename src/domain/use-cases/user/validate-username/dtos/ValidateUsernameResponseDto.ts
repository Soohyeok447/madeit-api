import { ApiProperty } from '@nestjs/swagger';

export class ValidateUsernameResponseDto {
  @ApiProperty({
    description: 'validation 결과',
    example: true,
  })
  public readonly result: boolean;

  public readonly errorCode?: number;

  public readonly message?: string;
}
