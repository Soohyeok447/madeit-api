import { MulterFile } from '../../../../domain/common/types';

export abstract class DirectoryMapper {
  public abstract getParamsToPutS3Object(
    imageFile: MulterFile,
    prefix?: string,
  ): s3Params;

  public abstract getCloudFrontUrlByS3Key(s3key: string): Promise<string>;
}

export type s3Params = {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
};
