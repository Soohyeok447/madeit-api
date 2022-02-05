import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/domain/enums/Category";
import { RoutineType } from "src/domain/enums/RoutineType";

export class PatchThumbnailResponseDto {
  @ApiProperty({
    description: `
    루틴 id`,
    example: '61f689d5fb44d01fd1cb3348'
  })
  id: string;

  @ApiProperty({
    description: `
    루틴 이름`,
    example: '수혁쌤과 함께하는 요가클래스'
  })
  name: string;

  @ApiProperty({
    description: `
    카테고리`,
    enum: Category,
    enumName: 'Category',
    example: Category.Health,
  })
  category: Category;

  @ApiProperty({
    description: `
    루틴 타입`,
    enum: RoutineType,
    enumName: 'RoutineType',
    example: RoutineType.Embeded,
  })
  type: RoutineType;

  @ApiProperty({
    description: `
    루틴 소개 스크립트`,
    example: '요가파이어'
  })
  introductionScript: string;

  @ApiProperty({
    description: `
    동기부여 문장`,
    example: '뻣뻣한 몸에 부드러움을 선사합시다'
  })
  motivation: string;

  @ApiProperty({
    description: `
    가격`,
    example: 0
  })
  price: number;

  //product id
  @ApiProperty({
    description: `
    관련 상품id 들`,
    example: ['id가 올 예정']
  })
  relatedProducts?: string[];

  @ApiProperty({
    description: `
    썸네일id`,
    example: '61f689d5fb44d01fd1cb3342',
    nullable: true
  })
  thumbnail: string;

  @ApiProperty({
    description: `
    카드 뉴스id`,
    isArray: true,
    type: String,
    example: '61fc4f071f05ea45bed7ba95',
    nullable: true
  })
  cardnews: string[];
}