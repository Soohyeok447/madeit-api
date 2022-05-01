import * as mongoose from 'mongoose';
import * as moment from 'moment';
moment.locale('ko');
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
