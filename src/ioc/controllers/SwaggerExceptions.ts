import { ApiProperty } from '@nestjs/swagger';

export class SwaggerServerException {
  @ApiProperty({ description: '메시지' })
  public readonly message: string;

  @ApiProperty({ description: '에러코드' })
  public readonly errorCode: number;
}

export class SwaggerJwtException {
  @ApiProperty({ description: '메시지', example: 'Unauthorized' })
  public readonly message: string;

  @ApiProperty({ description: '상태코드', example: 401 })
  public readonly statusCode: number;
}
