import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Routine } from 'src/domain/models/routine.model';

export class GetCartResponse {
  @ApiProperty({ 
    description: '장바구니 리스트' ,
    isArray:true,
    type: Routine,
  })
  @IsArray()
  shoppingCart: Routine[];
}
