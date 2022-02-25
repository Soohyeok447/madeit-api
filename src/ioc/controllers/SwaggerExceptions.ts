import { ApiProperty } from '@nestjs/swagger';

export class SwaggerServerException {
  @ApiProperty({ description: '메시지' })
  public message: string;

  @ApiProperty({ description: '에러코드' })
  public errorCode: number;
}

export class SwaggerJwtException {
  @ApiProperty({ description: '메시지', example: 'Unauthorized' })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 401 })
  public statusCode: number;
}
