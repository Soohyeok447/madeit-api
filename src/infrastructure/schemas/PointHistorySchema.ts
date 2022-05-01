import * as mongoose from 'mongoose';
import * as moment from 'moment';
moment.locale('ko');

export const PointHistorySchema: mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any>,
  any
> = new mongoose.Schema(
  {
    // 유저id
    user_id: {
      type: mongoose.Types.ObjectId,
      alias: 'userId',
    },

    // 포인트 입출력 관련 메시지
    message: {
      type: String,
    },

    // 포인트
    point: {
      type: Number,
    },

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
