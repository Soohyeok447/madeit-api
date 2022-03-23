import { getS3BucketName } from '../../../../environment';
import { s3Params, DirectoryMapper } from '../DirectoryMapper';
import { v4 } from 'uuid';
import { MulterFile } from '../../../../../domain/common/types';

export class AvatarMapper implements DirectoryMapper {
  getParamsToPutS3Object(imageFile: MulterFile): s3Params {
    return {
      Bucket: getS3BucketName(),
      Key: `origin/avatar/${v4()}`,
      Body: imageFile.buffer,
      ContentType: 'image',
    };
  }

  async getCloudFrontUrlByS3Key(s3key: string): Promise<string> {
    const url = `${process.env.AWS_CLOUDFRONT_URL}/origin/${s3key}`;

    return url;
  }
}
