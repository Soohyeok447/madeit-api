import * as mongoose from 'mongoose';

export const AdminSchema: mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any>,
  any
> = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);
