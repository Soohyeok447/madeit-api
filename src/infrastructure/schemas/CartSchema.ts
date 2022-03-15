import * as mongoose from 'mongoose';

//제한없는 array schema로 분리
export const CartSchema = new mongoose.Schema(
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
  },
  { versionKey: false },
);
