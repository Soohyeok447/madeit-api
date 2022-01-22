import { ApiProperty } from '@nestjs/swagger';
import { ImageType } from '../enums/image.enum';
import { ReferenceId } from '../enums/reference_id.enum';

//TODO swagger 다 정리합시다 image 관련 output 잘 정립
export class Image {
  // @ApiProperty({ description: '이미지 id' })
  id: string;

  // @ApiProperty({
  //   description: '이미지 타입',
  //   enum: ImageType,
  //   enumName: 'ImageType'
  // })
  type: ImageType;

  // @ApiProperty({description: '레퍼런스 id'})
  referenceId: string;
  
  // @ApiProperty({description: '레퍼런스모델'})
  referenceModel: ReferenceId;

  // @ApiProperty({description: 'S3 key'})
  key: string;
  
  // @ApiProperty({description: '파일이름'})
  filenames: string[];
}
