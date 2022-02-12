import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../../../../domain/enums/Category';
import { RoutineType } from '../../../../../domain/enums/RoutineType';

export class GetRoutineDetailResponseDto {
  @ApiProperty({
    description: `
    루틴 id`,
    example: '61f28d9b1ead82c6e3db36c8',
  })
  id: string;

  @ApiProperty({
    description: `
    루틴 이름`,
    example: '모닝조깅',
  })
  name: string;

  @ApiProperty({
    description: `
    카테고리`,
    enum: Category,
    example: Category.Health,
  })
  category: Category;

  @ApiProperty({
    description: `
    루틴 타입`,
    enum: RoutineType,
    example: RoutineType.Embeded,
  })
  type: RoutineType;

  @ApiProperty({
    description: `
    썸네일 이미지의 url`,
    example: 'http://d28okinpr57gbg.cloudfront.net/routine/모닝조깅/thumbnail',
  })
  thumbnail: string;

  @ApiProperty({
    description: `
    카드뉴스의 url`,
    isArray: true,
    type: String,
    example: [
      'http://d28okinpr57gbg.cloudfront.net/routine/모닝조깅/1',
      'http://d28okinpr57gbg.cloudfront.net/routine/모닝조깅/2',
    ],
  })
  cardnews: string[];

  @ApiProperty({
    description: `
    루틴 소개 스크립트`,
    example:
      '잠깐만 날 바라봐줘 널 따라 가고있어난 온 힘을 다해 비출게 잠깐만 날 지켜봐줘 우리 사이 변하지 않게 거기 그대로 with me',
  })
  introductionScript: string;

  @ApiProperty({
    description: `
    동기부여 문장`,
    example:
      '난 구름위에 올라가 붕 올라뜬 내 손을 꼭 잡아줘 내 맘이 보인다면 크게 외쳐줘',
  })
  motivation: string;

  @ApiProperty({
    description: `
    가격`,
    example: 0,
  })
  price: number;

  //product id
  @ApiProperty({
    description: `
    관련 상품id 들`,
    example: ['id', 'id'],
  })
  relatedProducts?: string[];
}
