import { ApiProperty } from '@nestjs/swagger';

export class GetPointHistoriesResponseDto {
  @ApiProperty({
    description: `
      유저 아이디`,
    example: '626e519eca78d9e56869662b',
  })
  public readonly id: string;

  @ApiProperty({
    description: `
      메시지`,
    example: '포인트 10000 차감 (포인트 환급 신청)',
  })
  public readonly message: string;

  @ApiProperty({
    description: `
      포인트 증감량`,
    example: '-10000',
  })
  public readonly point: string;

  @ApiProperty({
    description: `
      타임스탬프`,
    example: '2022/04/13 15:23:19',
  })
  public readonly timestamp: string;
}
