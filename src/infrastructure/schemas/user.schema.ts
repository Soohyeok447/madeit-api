import * as mongoose from 'mongoose';
import { Gender } from 'src/domain/models/enum/gender.enum';
import { Role } from 'src/domain/models/enum/role.enum';
import { Job } from 'src/domain/models/enum/job.enum';
import * as moment from 'moment';
moment.locale('ko');
import validator from 'validator';

export const UserSchema = new mongoose.Schema({
  email: { 
    type: String,
    validator(value){
      if (!validator.isEmail(value)) {
				throw new Error("이메일 형식이 아닙니다.");
			}
    }
  },

  user_id: { 
    type: String, 
    required:[true, 'user_id is required'],
    unique: true,
    alias: 'userId'
  },

  username: { 
    type: String,
  },

  refresh_token: { 
    type: String,
    alias:'refreshToken'
  },

  provider: { 
    type: String, 
    required: [true, 'provider is required'], 
  },

  is_admin:{
    type:Boolean,
    default:false,
    alias:'isAdmin',
  },

  roles: {
    type: [{
        type: String,
        enum: Role,
        default:Role.customer,
      }
    ],
  },

  gender: {
    type: String,
    enum: Gender,
  },

  job: { 
    type:String,
    enum: Job,
  },

  birth: { type: String },

  created_at: {
    type: String,
    default: moment().format(),
    alias:'createdAt'
  },
  updated_at: {
    type: String,
    alias:'updatedAt'
  },
  deleted_at: {
    type: String,
    alias:'deletedAt'
  },
}, { versionKey: false });