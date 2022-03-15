import { getS3BucketName } from '../../../../environment';
import { s3Params, S3Handler } from '../S3Handler';
import { v4 } from 'uuid';
import { MulterFile } from '../../../../../domain/common/types';

export class AvatarHandlerImpl implements S3Handler {
  constructor(private key: string) {}

  getParams(imageFile: MulterFile): s3Params {
    return {
      Bucket: getS3BucketName(),
      Key: `origin/${this.key}/${v4()}`,
      Body: imageFile.buffer,
      ContentType: 'image',
    };
  }

  async getUrl(
    baseUrl: string,
    key: string,
    filenames: string[],
  ): Promise<string | string[]> {
    const url = `${baseUrl}/${key}/${filenames[0]}`;

    return url;
  }
}
