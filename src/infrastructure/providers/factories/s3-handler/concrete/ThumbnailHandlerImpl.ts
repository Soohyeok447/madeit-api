import { MulterFile } from '../../../../../domain/common/types';
import { getS3BucketName } from '../../../../environment';
import { s3Params, S3Handler } from '../S3Handler';

export class ThumbnailHandlerImpl implements S3Handler {
  constructor(private key: string) {}

  getParams(imageFile: MulterFile): s3Params {
    return {
      Bucket: getS3BucketName(),
      Key: `origin/${this.key}`,
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
