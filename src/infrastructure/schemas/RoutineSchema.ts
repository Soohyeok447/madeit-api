import * as mongoose from 'mongoose';

export const RoutineSchema = new mongoose.Schema(
  {
    //userId
    userId: {
      type: String,
      required: true,
    },

    // 루틴 title
    title: {
      type: String,
      required: true,
    },

    // 루틴 알람 Hour
    hour: {
      type: Number,
      required: true,
    },

    // 루틴 알람 Minute
    minute: {
      type: Number,
      required: true,
    },

    // 루틴 알람 반복 요일
    days: [
      {
        type: Number,
        required: true,
      },
    ],

    //알람 유튜브 주소
    alarm_video_id: {
      type: String,
      required: false,
      alias: 'alarmVideoId',
      default: null,
    },

    //루틴 유튜브 주소
    content_video_id: {
      type: String,
      required: false,
      alias: 'contentVideoId',
      default: null,
    },

    //루틴 타이머
    timer_duration: {
      type: Number,
      required: false,
      default: null,
    },

    //루틴 알람 활성화 여부
    activation: {
      type: Boolean,
      default: true
    },
  },
  { versionKey: false },
);
