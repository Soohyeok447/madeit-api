import * as mongoose from 'mongoose';

export const DaySchema = new mongoose.Schema({
  // 날짜 ( XXXX-XX-XX )
  date: {
    type: String,
  },

  // 일정 (하루단위)
  daily_schedules: {
    type: [{
      //여기서 validate를 조져도 좋을 것 같은데..
      //ex) HH:MM
      from: {
        type: String,
      },

      to: {
        type: String,
      },

      routine_id: {
        type: String,
        alias: 'routineId'
      }
    }],

    alias: 'dailySchedules',
  }
},
  { versionKey: false },
);
