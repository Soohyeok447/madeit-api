import * as mongoose from 'mongoose';
import * as moment from 'moment';
moment.locale('ko');

export const UserSchema = new mongoose.Schema(
  {
    //유저 아바타 사진 id
    avatar_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Image',
      alias: 'avatarId',
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

    // 나이
    age: {
      type: Number,
    },

    // 목표
    goal: {
      type: String,
    },

    // 상태메시지
    status_message: {
      type: String,
      alias: 'statusMessage',
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

    // 어드민 여부 ( db 직접 조작 )
    is_admin: {
      type: Boolean,
      default: false,
      alias: 'isAdmin',
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
