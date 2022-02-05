import { ApiProperty } from "@nestjs/swagger";
import { SwaggerServerException } from "../../SwaggerExceptions";

export class SwaggerInvalidTimeException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '유효하지않은 time 2600' })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 400 })
  public statusCode: number;

  @ApiProperty({ description: '에러종류', example: 'Bad Request' })
  public error: string;
}