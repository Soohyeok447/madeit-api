import { NestInterceptor, Type } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

export const AvatarImageInterceptor: Type<NestInterceptor<any, any>> =
  FileInterceptor('avatar');

//직접 putObject하도록 수정
// export const BannerImageInterceptor = FileInterceptor('bannerImage',
// });

export const ThumbnailInterceptor: Type<NestInterceptor<any, any>> =
  FileInterceptor('thumbnail');

export const CardnewsInterceptor: Type<NestInterceptor<any, any>> =
  FilesInterceptor('cardnews', 30);

// export const RoutineImagesInterceptor = FileFieldsInterceptor([
//   {
//     name: 'thumbnail',
//     maxCount: 1,
//   },
//   {
//     name: 'cardnews',
//     maxCount: 10,
//   },
// ]);

export const ImageInterceptor: Type<NestInterceptor<any, any>> =
  FileInterceptor('image');
