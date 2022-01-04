import * as mongoose from 'mongoose';
import { Gender } from 'src/domain/models/enum/gender.enum';
import { Role } from 'src/domain/models/enum/role.enum';
import { Job } from 'src/domain/models/enum/job.enum';
import * as moment from 'moment';
moment.locale('ko');
import validator from 'validator';

/**
 * 만약 documents가 너무 커진다 싶으면
 * shopping_cart, order_history 스키마 분리 후, populate로 참조
 * schedule 스키마로 분리후 populate로 참조
 */
export const UserSchema = new mongoose.Schema(
  {
    // 유저 이메일
    email: {
      type: String,
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error('이메일 형식이 아닙니다.');
        }
      },
    },

    // 유저 서드파티 id
    user_id: {
      type: String,
      required: [true, 'user_id is required'],
      unique: true,
      alias: 'userId',
    },

    // 유저 네임
    username: {
      type: String,
    },

    // 리프레시 토큰
    refresh_token: {
      type: String,
      alias: 'refreshToken',
    },

    // 서드파티 제공 플랫폼
    provider: {
      type: String,
      required: [true, 'provider is required'],
    },

    // 유저 성별
    gender: {
      type: String,
      enum: Gender,
    },

    // 유저 직업
    job: {
      type: String,
      enum: Job,
    },

    // 유저 생일
    birth: { type: String },

    // 장바구니 (최대 인덱스는 루틴의 개수)
    shopping_cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Routine',
        alias: 'shoppingCart',
      },
    ],

    // 유료 루틴 구매 내역
    //TODO 구독, 유료루틴으로 구별
    order_history: [
      {
        //만료 될 날짜
        expiration_date: {
          type: String,
          default: moment().add(30, 'days').format('YYYY-MM-DD'),
          alias: 'expirationDate',
        },

        // 남은 횟수
        remained_amount: {
          type: Number,
          required: [true, 'amount is required'],
          alias: 'remainedAmount',
        },

        // 루틴 아이디
        routine_id: {
          type: mongoose.Types.ObjectId,
          ref: 'Routine',
          alias: 'routineId',
        },
      },
    ],

    // 주소 // TODO 관련 service 필요
    address: {
      type: String,
    },

    // 상세주소 // TODO 관련 service 필요
    address_detail: {
      type: String,
    },

    // 어드민 여부 ( db 직접 조작 )
    is_admin: {
      type: Boolean,
      default: false,
      alias: 'isAdmin',
    },

    // role ( set method로 조작 )
    roles: [
      {
        type: String,
        enum: Role,
        default: Role.customer,
      },
    ],

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
