import * as mongoose from 'mongoose';
import * as moment from 'moment';
moment.locale('ko');

export const BannerSchema: mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any>,
  any
> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content_video_id: {
      type: String,
      required: true,
    },

    banner_image_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    created_at: {
      type: String,
      default: moment().format(),
      alias: 'createdAt',
    },
  },
  { versionKey: false },
);
