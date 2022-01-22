import * as mongoose from 'mongoose';
import { ImageType } from 'src/domain/common/enums/image.enum';
import { ReferenceId } from 'src/domain/common/enums/reference_id.enum';

//https://d28okinpr57gbg.cloudfront.net/
//HD/ (resolution) query로 받음
//card-news/%ED%85%8C%EC%8A%A4%ED%8A%B82/ (key) (reference_id로 key를  찾음) 
//20220116-handsomeguyjungbin.PNG (fileName) (reference_id로 fileName을 찾음)
export const ImageSchema = new mongoose.Schema(
  {
    //이미지 타입
    type: {
      type: String,
      enum: ImageType,
      required: true,
    },

    //연관id
    reference_id: {
      type: mongoose.Types.ObjectId,
      refPath: 'reference_model',
    },

    //연관id model
    reference_model: {
      type: String,
      required: true,
      enum: ReferenceId
    },

    //키
    key: {
      type: String,
      required: true,
    },

    filenames: [{
      type: String,
    }]
  },
  { versionKey: false },
);
