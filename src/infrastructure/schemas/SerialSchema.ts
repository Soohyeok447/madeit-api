import * as mongoose from 'mongoose';

export const SerialSchema: mongoose.Schema<
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

    // 유저 이메일
    email: {
      type: String,
    },

    // 시리얼넘버
    serial: {
      type: String,
    },

    created_at: {
      type: Date,
      expires: 1800,
      default: Date.now,
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
