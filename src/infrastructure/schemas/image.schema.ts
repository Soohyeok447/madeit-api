import * as mongoose from 'mongoose';
import { Device } from 'src/domain/common/enums/device.enum';
import { ImageType } from 'src/domain/common/enums/image.enum';

//하면서 계속 수정;
export const ImageSchema = new mongoose.Schema(
  {
    //이미지 타입
    type: {
      type: ImageType,
      required: true,
    },

    //이미지 리스트
    image: [{
      //디바이스 타입
      device: {
        type: String,
        enum: Device,
        required: true,
      },

      //s3에 저장된 리사이징 이미지
      url: {
        type: String,
        required: true,
      }
    }]
  },
  { versionKey: false },
);
