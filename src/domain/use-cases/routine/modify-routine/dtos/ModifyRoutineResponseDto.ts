import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/domain/enums/Category';
import { RoutineType } from 'src/domain/enums/RoutineType';
import { RoutineModel } from '../../../../models/RoutineModel';

export class ModifyRoutineResponseDto {
  @ApiProperty({ description: '루틴 id', example: '61f689d5fb44d01fd1cb3348' })
  id: string;

  @ApiProperty({ description: '루틴 이름', example: '오바마 따라잡기' })
  name: string;

  @ApiProperty({
    description: '카테고리',
    enum: Category,
    enumName: 'Category',
    example: Category.Health,
  })
  category: Category;

  @ApiProperty({
    description: '루틴 타입',
    enum: RoutineType,
    enumName: 'RoutineType',
    example: 'embeded',
  })
  type: RoutineType;

  @ApiProperty({
    description: '썸네일 이미지의 url',
    example: '61f689d5fb44d01fd1cb3342',
    nullable: true
  }) //TODO fix to return url
  thumbnail: string;

  @ApiProperty({
    description: '카드 뉴스의 url들',
    isArray: true,
    type: String,
    example: ['61f689d5fb44d01fd1cb3345', '61f689d5fb44d01fd1cb3345'],
    nullable: true
  }) //TODO fix to return url
  cardnews: string[];

  @ApiProperty({
    description: '루틴 소개 스크립트',
    example: '버락 오바마 전 미국 대통령은 백악관 집무실로 출근하기 전에 웨이트트레이닝과 유산소 운동을 했습니다'
  })
  introductionScript: string;

  @ApiProperty({
    description: '동기부여 문장',
    example: '갓등의 삶을 살아봅시다.'
  })
  motivation: string;

  @ApiProperty({
    description: '가격',
    example: 0
  })
  price: number;

  //product id
  @ApiProperty({
    description: '관련 상품id 들',
    example: ['id가 올 예정'],
    nullable: true,
  })
  relatedProducts?: string[];
}
