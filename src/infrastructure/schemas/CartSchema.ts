import * as mongoose from 'mongoose';
import * as moment from 'moment';
moment.locale('ko');

//제한없는 array schema로 분리
export const CartSchema: mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any>,
  any
> = new mongoose.Schema(
  {
    //유저 아이디
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      alias: 'userId',
    },

    //루틴 아이디
    recommended_routine_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Recommended-Routine',
      required: true,
      alias: 'recommendedRoutineId',
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
