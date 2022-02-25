import * as mongoose from 'mongoose';

/**
 * 관리자가 직접 collection 관리
 */
export const ChallengeSchema = new mongoose.Schema(
  {
    // 루틴 이름
    name: {
      type: String,
    },

    // 루틴 알람 Hour
    hour: {
      type: Number,
    },

    // 루틴 알람 Minute
    minute: {
      type: Number,
    },

    // 루틴 알람 반복 요일
    days: [
      {
        type: Number,
      },
    ],

    //알람 유튜브 주소
    alarm_video_id: {
      type: String,
      alias: 'alarmVideoId',
    },
    
    //루틴 유튜브 주소
    content_video_id: {
      type: String,
      alias: 'contentVideoId',
    },

    thumbnail_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Image',
    },

    // 카드 뉴스 이미지
    cardnews_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Image',
      alias: 'cardNews',
    },

    // 소개 스크립트
    introduction_script: {
      type: String,
      alias: 'introductionScript',
    },

    // 동기부여 문장
    motivation: {
      type: String,
    },

    // 루틴 가격 (유료일 때만 존재)
    price: {
      type: Number,
    },

    // 연관 상품 목록
    related_products: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        alias: 'relatedProducts',
      },
    ],
  },
  { versionKey: false },
);
