import { MulterFile } from '../../../../domain/common/types';

export abstract class S3Handler {
  abstract getParamsToPutS3Object(
    imageFile: MulterFile,
    title?: string,
  ): s3Params;

  abstract getCloudFrontUrlByS3Key(
    s3keys: string[],
  ): Promise<string | string[]>;
}

export type s3Params = {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
};
