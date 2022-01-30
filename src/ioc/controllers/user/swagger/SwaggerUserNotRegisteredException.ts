import { ApiProperty } from "@nestjs/swagger";
import { SwaggerServerException } from "../../SwaggerExceptions";

export class SwaggerUserNotRegisteredException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '유저 등록이 필요함' })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 403 })
  public statusCode: number;

  @ApiProperty({ description: '에러종류', example: 'Forbidden' })
  public error: string;
}