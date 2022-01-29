import * as mongoose from 'mongoose';
import { ImageType } from 'src/domain/enums/ImageType';
import { ReferenceModel } from 'src/domain/enums/ReferenceModel';

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
      enum: ReferenceModel,
    },

    //키
    key: {
      type: String,
      required: true,
    },

    filenames: [
      {
        type: String,
      },
    ],
  },
  { versionKey: false },
);
