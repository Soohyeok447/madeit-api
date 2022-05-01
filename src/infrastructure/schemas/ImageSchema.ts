import * as mongoose from 'mongoose';
import { ImageType } from '../../domain/common/enums/ImageType';
import { ReferenceModel } from '../../domain/common/enums/ReferenceModel';
import * as moment from 'moment';
moment.locale('ko');

export const ImageSchema: mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any>,
  any
> = new mongoose.Schema(
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

    //cloud DB에 저장된 객체 URL key
    cloud_keys: [
      {
        type: String,
        required: true,
      },
    ],

    created_at: {
      type: String,
      default: moment().format(),
      alias: 'createdAt',
    },
    updated_at: {
      type: String,
      alias: 'updatedAt',
    },
    deleted_at: {
      type: String,
      alias: 'deletedAt',
    },
  },
  { versionKey: false },
);
