import * as mongoose from 'mongoose';
import { Category } from 'src/domain/common/enums/category.enum';
import { RoutineType } from 'src/domain/common/enums/routine_type.enum';

/**
 * 관리자가 직접 collection 관리
 */
export const RoutineSchema = new mongoose.Schema(
  {
    // 루틴 이름
    name: {
      type: String,
    },

    //카테고리
    category: {
      type: String,
      required: true,
      enum: Category,
    },

    // 루틴의 타입
    type: {
      type: String,
      enum: RoutineType,
    },

    // 썸네일 이미지 주소
    thumbnail_url: {
      type: String,
      alias: 'thumbnailUrl',
    },

    // 소개 스크립트
    introduction_script: {
      type: String,
      alias: 'introductionScript',
    },

    // 루틴 소개 이미지 주소
    introduction_image_url: {
      type: String,
      alias: 'introductionImageUrl',
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
