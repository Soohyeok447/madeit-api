import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IssueExchangeTokenRequestDto {
  @ApiProperty({
    description: `
      시리얼넘버`,
    example: '4139',
  })
  @IsString()
  public readonly serial: string;
}
