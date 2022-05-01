import * as mongoose from 'mongoose';
import * as moment from 'moment';
moment.locale('ko');
/**
 * app 내부 product 없이 전부 스마트스토어로 판매하게 된다면
 * name: string,
 * product_url: string,
 * thumbnail_image_url: stirng,
 * price: number,
 * 로 축소
 */
export const ProductSchema: mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any>,
  any
> = new mongoose.Schema(
  {
    // 상품 이름
    name: {
      type: String,
    },

    //상품 소개
    description: {
      type: String,
    },

    // 상품 가격
    price: {
      type: Number,
    },

    //썸네일 이미지 주소
    thumbnail_image_url: {
      type: String,
      alias: 'thumbnailImageUrl',
    },

    //상품소개 이미지 주소
    introduction_image_url: {
      type: String,
      alias: 'introductionImageUrl',
    },

    // 판매자 이름
    seller: {
      type: String,
    },

    // 판매자 핸드폰 번호
    seller_phone: {
      type: Number,
    },

    // 판매자 이메일
    seller_email: {
      type: String,
      alias: 'sellerEmail',
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
