import * as mongoose from 'mongoose';
import * as moment from 'moment';
moment.locale('ko');

export const ImageV2Schema: mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any>,
  any
> = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
    },

    mimetype: {
      type: String,
    },

    description: {
      type: String,
      required: false,
    },

    created_at: {
      type: String,
      default: moment().format(),
      alias: 'createdAt',
    },
  },
  { versionKey: false },
);
