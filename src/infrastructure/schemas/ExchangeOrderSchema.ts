import * as mongoose from 'mongoose';
import * as moment from 'moment';
moment.locale('ko');

export const ExchangeOrderSchema: mongoose.Schema<
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

    amount: {
      type: Number,
    },

    bank: {
      type: String,
    },

    account: {
      type: String,
    },

    state: {
      type: String,
      default: '환급 전',
    },

    created_at: {
      type: String,
      default: moment().format(),
      alias: 'createdAt',
    },
  },
  { versionKey: false },
);
