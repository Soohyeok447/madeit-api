import { ApiProperty } from '@nestjs/swagger';

export class SwaggerServerException {
  @ApiProperty({ description: '메시지' })
  public message: string;

  @ApiProperty({ description: '상태코드' })
  public statusCode: number;

  @ApiProperty({ description: '에러종류' })
  public error: string;
}

export class SwaggerJwtException {
  @ApiProperty({ description: '메시지', example: 'Unauthorized' })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 401 })
  public statusCode: number;
}
