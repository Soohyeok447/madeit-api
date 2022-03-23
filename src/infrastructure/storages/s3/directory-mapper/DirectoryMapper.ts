import { MulterFile } from '../../../../domain/common/types';

export abstract class DirectoryMapper {
  abstract getParamsToPutS3Object(
    imageFile: MulterFile,
    prefix?: string,
  ): s3Params;

  abstract getCloudFrontUrlByS3Key(s3key: string): Promise<string>;
}

export type s3Params = {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
};
