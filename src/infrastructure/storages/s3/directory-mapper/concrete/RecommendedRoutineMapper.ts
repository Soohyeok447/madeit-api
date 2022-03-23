import { MulterFile } from '../../../../../domain/common/types';
import { getS3BucketName } from '../../../../environment';
import { s3Params, DirectoryMapper } from '../DirectoryMapper';

export class RecommendedRoutineMapper implements DirectoryMapper {
  getParamsToPutS3Object(imageFile: MulterFile, prefix?: string): s3Params {
    if (prefix === 'thumbnail') {
      return {
        Bucket: getS3BucketName(),
        Key: `origin/recommended-routine/${prefix}/thumbnail`,
        Body: imageFile.buffer,
        ContentType: 'image',
      };
    }

    const splittedImageName = imageFile['originalname'].split('.');
    splittedImageName.pop();
    const imageName = splittedImageName.join('');

    const params = {
      Bucket: getS3BucketName(),
      Key: `origin/recommended-routine/${prefix}/cardnews/${imageName}`,
      Body: imageFile.buffer,
      ContentType: 'image',
    };

    return params;
  }

  async getCloudFrontUrlByS3Key(s3key: string): Promise<string> {
    const url = `${process.env.AWS_CLOUDFRONT_URL}/origin/${s3key}`;

    return url;
  }
}
