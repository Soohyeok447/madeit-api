import { ApiProperty } from "@nestjs/swagger";
import { SwaggerServerException } from "../../SwaggerExceptions";

export class SwaggerRoutineNotFoundException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '루틴을 찾을 수 없음' })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 404 })
  public statusCode: number;

  @ApiProperty({ description: '에러종류', example: 'Not Found' })
  public error: string;
}