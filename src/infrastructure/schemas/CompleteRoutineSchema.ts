import * as mongoose from 'mongoose';
import * as moment from 'moment';
moment.locale('ko');

export const CompleteRoutineSchema: mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any>,
  any
> = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      alias: 'userId',
    },

    routine_id: {
      type: mongoose.Types.ObjectId,
      alias: 'routineId',
    },

    created_at: {
      type: String,
      default: moment().format(),
      alias: 'createdAt',
    },
  },
  { versionKey: false },
);
