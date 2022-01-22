import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import * as multerS3 from "multer-s3";
import { s3 } from "src/infrastructure/config/s3";
import { getS3BucketName } from "src/infrastructure/environment";
import * as moment from 'moment';
moment.locale('ko');

// export const ProfileImageInterceptor = FileInterceptor('profileImage', {
//   storage: multerS3({
//     s3,
//     bucket: getS3BucketName(),
//     key: function (_req, file, cb) {
//       cb(null, `origin/profile/${moment().format('YYYYMMDD-HH:mm:ss')}-${file.originalname}`);
//     },
//   }),
// });

export const ProfileImageInterceptor = FileInterceptor('profileImage');

export const BannerImageInterceptor = FileInterceptor('bannerImage', {
  storage: multerS3({
    s3,
    bucket: getS3BucketName(),
    key: function (_req, file, cb) {

      cb(null, `origin/banner/${moment().format('YYYYMMDD-HH:mm:ss')}-${file.originalname}`);
    },
  }),
});

export const ProductThumbnailInterceptor = FileInterceptor('productImage', {
  storage: multerS3({
    s3,
    bucket: getS3BucketName(),
    key: function (_req, file, cb) {
      cb(null, `origin/product-thumbnail/${moment().format('YYYYMMDD-HH:mm:ss')}-${file.originalname}`);
    },
  }),
});

export const RoutineImagesInterceptor = FileFieldsInterceptor([
  {
    name: 'thumbnail',
    maxCount: 1,
  },
  {
    name:'cardnews',
    maxCount: 10,
  }
]);