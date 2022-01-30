import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from 'src/domain/enums/Category';
import { RoutineType } from 'src/domain/enums/RoutineType';

export class ModifyRoutineRequestDto {
  // @ApiProperty({ description: '루틴 id' })
  // @IsString()
  // routineId: string;

  @ApiProperty({
    description: '루틴 이름',
    example: '오바마 따라잡기'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '카테고리',
    enum: Category,
    example: Category.Health
  })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({
    description: '루틴 타입',
    enum: RoutineType,
    example: RoutineType.Embeded
  })
  @IsEnum(RoutineType)
  type: RoutineType;

  @ApiProperty({
    description: '루틴 설명 스크립트',
    example: '버락 오바마 전 미국 대통령은 백악관 집무실로 출근하기 전에 웨이트트레이닝과 유산소 운동을 했습니다'
  })
  @IsString()
  introductionScript: string;

  @ApiProperty({
    description: '루틴과 관련된 동기부여 문장',
    example: '갓등의 삶을 살아봅시다.'
  })
  @IsString()
  motivation: string;

  @ApiProperty({
    description: '루틴 가격',
    example: 0,
  })
  @IsNumberString() //TODO IsNumber로 수정
  price: number;

  @ApiProperty({
    description: '루틴과 관련된 상품들의 id',
    required: false,
    example: ['asdf', 'qwer']
  })
  @IsArray()
  @IsOptional()
  relatedProducts?: string[];

  // @ApiProperty({
  //   description: '썸네일 이미지의',
  //   type: 'string',
  //   format: 'binary',
  //   required: false,
  // })
  // thumbnail: any;

  // @ApiProperty({
  //   description: '카드뉴스 이미지',
  //   type: 'string',
  //   format: 'binary',
  //   isArray: true,
  //   required: false,
  // })
  // cardnews: any;
}
