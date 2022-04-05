import { MulterFile } from '../../../../../domain/common/types';
import { getS3BucketName } from '../../../../environment';
import { s3Params, DirectoryMapper } from '../DirectoryMapper';

export class RecommendedRoutineMapper implements DirectoryMapper {
  public getParamsToPutS3Object(
    imageFile: MulterFile,
    prefix?: string,
  ): s3Params {
    if (prefix === 'thumbnail') {
      return {
        Bucket: getS3BucketName(),
        Key: `origin/recommended-routine/${prefix}/thumbnail`,
        Body: imageFile.buffer,
        ContentType: 'image',
      };
    }

    const splittedImageName: string[] = imageFile['originalname'].split('.');
    splittedImageName.pop();
    const imageName: string = splittedImageName.join('');

    const params: {
      Bucket: 'madeit' | 'madeit-dev';
      Key: string;
      Body: Buffer;
      ContentType: string;
    } = {
      Bucket: getS3BucketName(),
      Key: `origin/recommended-routine/${prefix}/cardnews/${imageName}`,
      Body: imageFile.buffer,
      ContentType: 'image',
    };

    return params;
  }

  public async getCloudFrontUrlByS3Key(s3key: string): Promise<string> {
    const url: any = `${process.env.AWS_CLOUDFRONT_URL}/origin/${s3key}`;

    return url;
  }
}
