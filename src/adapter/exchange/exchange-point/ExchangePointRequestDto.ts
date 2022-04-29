import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ExchangePointRequestDto {
  @ApiProperty({
    description: `
      은행명`,
    example: '우리은행',
  })
  @IsString()
  public readonly bank: string;

  @ApiProperty({
    description: `
      계좌번호`,
    example: '1002244982018',
  })
  @IsString()
  public readonly account: string;

  @ApiProperty({
    description: `
      환급할 포인트 (만 단위)`,
    example: 1,
  })
  @IsNumber()
  public readonly amount: number;
}
