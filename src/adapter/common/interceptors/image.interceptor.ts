import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

export const AvatarImageInterceptor = FileInterceptor('avatar');

//직접 putObject하도록 수정
// export const BannerImageInterceptor = FileInterceptor('bannerImage',
// });

// export const ProductThumbnailInterceptor = FileInterceptor('productImage',
//
// });

export const RoutineImagesInterceptor = FileFieldsInterceptor([
  {
    name: 'thumbnail',
    maxCount: 1,
  },
  {
    name: 'cardnews',
    maxCount: 10,
  },
]);
