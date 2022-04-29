import * as mongoose from 'mongoose';

export const ExchangeTokenSchema: mongoose.Schema<
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

    // exchangeToken
    token: {
      type: String,
    },

    created_at: {
      type: Date,
      expires: 300,
      default: Date.now,
      alias: 'createdAt',
    },
  },
  { versionKey: false },
);
