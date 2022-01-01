import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAllRoutinesRequest {
  @ApiProperty({ description: '다음 페이징 커서' })
  @IsString()
  @IsOptional()
  nextCursor?: string;
}
