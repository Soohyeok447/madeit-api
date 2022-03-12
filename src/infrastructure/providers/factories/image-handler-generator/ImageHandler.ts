import { MulterFile } from '../../../../domain/common/types';

export abstract class ImageHandler {
  abstract getParams(imageFile: MulterFile): ImageParams;

  abstract getUrl(
    baseUrl: string,
    key: string,
    filenames: string[],
  ): Promise<string | string[]>;
}

export type ImageParams = {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
};
