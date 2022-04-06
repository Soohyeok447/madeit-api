import * as mongoose from 'mongoose';

/**
 * 관리자가 직접 information board 관리
 */
export const InformationBoardSchema: mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any>,
  any
> = new mongoose.Schema(
  {
    // 루틴 title
    title: {
      type: String,
      required: true,
    },

    // 조회수
    views: {
      type: Number,
      default: 0,
    },

    // 카드 뉴스 id
    cardnews_id: {
      type: mongoose.Types.ObjectId,
      // ref: 'Image',
      default: null,
    },
  },
  { versionKey: false },
);
