import * as mongoose from 'mongoose';
import * as moment from 'moment';
moment.locale('ko');
import { Category } from '../../domain/common/enums/Category';
import { FixedField } from '../../domain/common/enums/FixedField';

/**
 * 관리자가 직접 collection 관리
 */
export const RecommendedRoutineSchema: mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any>,
  any
> = new mongoose.Schema(
  {
    // 루틴 title
    title: {
      type: String,
    },

    // 루틴 알람 Hour
    hour: {
      type: Number,
      default: null,
    },

    // 루틴 알람 Minute
    minute: {
      type: Number,
      default: null,
    },

    // 루틴 알람 반복 요일
    days: [
      {
        type: Number,
        default: [],
      },
    ],

    //알람 유튜브 id
    alarm_video_id: {
      type: String,
      alias: 'alarmVideoId',
      default: null,
    },

    //루틴 유튜브 id
    content_video_id: {
      type: String,
      alias: 'contentVideoId',
      default: null,
    },

    //루틴 타이머
    timer_duration: {
      type: Number,
      default: null,
    },

    // 썸네일 id
    thumbnail_id: {
      type: mongoose.Types.ObjectId,
      // ref: 'Image',
      default: null,
    },

    // 유튜브 썸네일
    youtube_thumbnail: {
      type: String,
    },

    // 카드 뉴스 id
    cardnews_id: {
      type: mongoose.Types.ObjectId,
      // ref: 'Image',
      default: null,
    },

    //카테고리
    category: {
      type: String,
      enum: Category,
    },

    // 소개 스크립트
    introduction: {
      type: String,
    },

    // 루틴 가격
    price: {
      type: Number,
      default: 0,
    },

    //고정 필드
    fixed_fields: [
      {
        type: String,
        enum: FixedField,
        alias: 'fixedFields',
        default: [],
      },
    ],

    // 연관 상품 목록
    // related_products: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Product',
    //     alias: 'relatedProducts',
    //     default: [],
    //   },
    // ],

    // 포인트
    point: {
      type: Number,
      default: 0,
    },

    // 경험치
    exp: {
      type: Number,
      default: 0,
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
