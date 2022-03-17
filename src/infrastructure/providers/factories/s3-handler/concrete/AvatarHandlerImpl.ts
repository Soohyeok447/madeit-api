import { getS3BucketName } from '../../../../environment';
import { s3Params, S3Handler } from '../S3Handler';
import { v4 } from 'uuid';
import { MulterFile } from '../../../../../domain/common/types';

export class AvatarHandlerImpl implements S3Handler {
  getParamsToPutS3Object(imageFile: MulterFile): s3Params {
    return {
      Bucket: getS3BucketName(),
      Key: `origin/avatar/${v4()}`,
      Body: imageFile.buffer,
      ContentType: 'image',
    };
  }

  async getCloudFrontUrlByS3Key(s3keys: string[]): Promise<string | string[]> {
    const url = `${process.env.AWS_CLOUDFRONT_URL}/${s3keys[0]}`;

    return url;
  }
}
