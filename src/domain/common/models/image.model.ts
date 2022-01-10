import { ApiProperty } from '@nestjs/swagger';
import { Device } from '../enums/device.enum';
import { ImageType } from '../enums/image.enum';

export class SubImage {
  @ApiProperty({ 
    description: '디바이스 타입', 
    enum: Device, 
    enumName: 'Device' 
  })
  device: Device;

  @ApiProperty({ description: 'url' })
  url: string;
}

export class Image {
  @ApiProperty({ description: '이미지 id' })
  id: string;

  @ApiProperty({description: '이미지 타입'})
  type: ImageType;

  @ApiProperty({ description: '이미지들', enum: SubImage })
  image: SubImage[];
}
