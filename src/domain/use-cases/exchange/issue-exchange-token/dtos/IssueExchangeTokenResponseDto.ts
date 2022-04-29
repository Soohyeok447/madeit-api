import { ApiProperty } from '@nestjs/swagger';

export class IssueExchangeTokenResponseDto {
  @ApiProperty({
    description: `
      포인트 교환토큰`,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGMzNWJlMjQ3YjZlN2MzYjdkOGMwZiIsImlhdCI6MTY1MTI0NjI5NSwiZXhwIjoxNjUxMjQ2NDc1LCJpc3MiOiJodHRwczovL2FwaS5tYWRlaXQuZGV2bGllLmtyIn0.K93pkwspT3BUm_XlDARMMHOA4Oj1y9qG9QiTKHDcjY4',
  })
  public readonly exchangeToken: string;
}
