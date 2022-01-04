import * as mongoose from 'mongoose';
import { Day } from 'src/domain/models/enum/day.enum';

//제한없는 array schema로 분리
export const AlarmSchema = new mongoose.Schema(
  {
    //유저 아이디
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      alias: 'userId',
    },

    //알람 라벨
    label: {
      type: String,
    },

    //알람 시간
    time: {
      type: Number,
      required: true,
    },

    //알람 반복 요일
    day: [
      {
        type: String,
        enum: Day,
      },
    ],

    //루틴 아이디
    routine_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Routine',
      required: true,
      alias: 'routineId',
    },
  },
  { versionKey: false },
);
