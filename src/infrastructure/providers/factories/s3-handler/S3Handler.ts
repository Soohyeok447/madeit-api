import { MulterFile } from '../../../../domain/common/types';

export abstract class S3Handler {
  abstract getParams(imageFile: MulterFile): s3Params;

  abstract getUrl(
    baseUrl: string,
    key: string,
    filenames: string[],
  ): Promise<string | string[]>;
}

export type s3Params = {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
};
