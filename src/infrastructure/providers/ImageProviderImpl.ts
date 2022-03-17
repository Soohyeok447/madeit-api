/* eslint-disable @typescript-eslint/no-unused-vars */
import { ImageType } from '../../domain/common/enums/ImageType';
import { ReferenceModel } from '../../domain/common/enums/ReferenceModel';
import { Resolution } from '../../domain/common/enums/Resolution';
import { ImageModel } from '../../domain/models/ImageModel';
import { ImageProvider, CloudKey } from '../../domain/providers/ImageProvider';
import { CreateImageDto } from '../../domain/repositories/image/dtos/CreateImageDto';
import { MulterFile } from '../../domain/common/types/MulterFile';
import { s3 } from '../config/s3';
import { getS3BucketName } from '../environment';
import { S3Handler, s3Params } from './factories/s3-handler/S3Handler';
import { S3HandlerFactoryImpl } from './factories/s3-handler/concrete/S3HandlerFactoryImpl';
import { NotFoundImageException } from './exceptions/image-provider/NotFoundImageException';
import { PutObjectToS3Error } from './errors/image-provider/PutObjectToS3Error';
import { DeleteObjectToS3Error } from './errors/image-provider/DeleteObjectFromS3Error';

export class ImageProviderImpl implements ImageProvider {
  public getMappedImageModel(imageDocument: ImageModel): ImageModel {
    try {
      const mappedImageModel: ImageModel = {
        id: imageDocument['_id'],
        type: imageDocument['type'],
        referenceId: imageDocument['reference_id'],
        referenceModel: imageDocument['reference_model'],
        cloudKeys: imageDocument['cloud_keys'],
      };

      return mappedImageModel;
    } catch (err) {
      throw new NotFoundImageException();
    }
  }

  public putImageFileToCloudDb(
    imageFile: MulterFile,
    imageType: ImageType,
    title?: string,
  ): CloudKey {
    const s3Handler: S3Handler = new S3HandlerFactoryImpl().createHandler(
      imageType,
    );

    const params: s3Params = s3Handler.getParamsToPutS3Object(imageFile, title);

    try {
      const result = s3.putObject(params, (_, __) => null);

      const splittedResult =
        result['response']['request']['params']['Key'].split('/');

      splittedResult.shift();

      const cloud_key = splittedResult.join('/');
      //s3 key
      return cloud_key;
    } catch (err) {
      throw new PutObjectToS3Error();
    }
  }

  public deleteImageFileFromCloudDb(cloudKey: string): void {
    const bucket = getS3BucketName();

    const resolution: {
      key: string;
      value: string;
    }[] = Object.entries(Resolution).map(([key, value]) => ({ key, value }));

    const originParams = {
      Bucket: bucket,
      Key: `origin/${cloudKey}`, //s3 key
    };

    try {
      s3.deleteObject(originParams, (_, __) => null);
    } catch (err) {
      throw new DeleteObjectToS3Error();
    }

    resolution.forEach((res) => {
      const resizeParams = {
        Bucket: bucket,
        Key: `resize/${cloudKey}/${res.value}`,
      };

      try {
        s3.deleteObject(resizeParams, (_, __) => null);
      } catch (err) {
        throw new DeleteObjectToS3Error();
      }
    });
  }

  public async requestImageToCDN(
    imageModel: ImageModel,
  ): Promise<string | string[]> {
    const cloudKeys: string[] = imageModel['cloud_keys'];
    const type: string = imageModel['type'];

    const imageHandler: S3Handler = new S3HandlerFactoryImpl().createHandler(
      type,
    );

    const url: string | string[] = await imageHandler.getCloudFrontUrlByS3Key(
      cloudKeys,
    );

    return url;
  }

  /**
   * S3에 이미지를 저장하면 S3Key를 받는데 그걸로 ImageCreateDto를 생성
   *
   * 이게 여기있다는게 참 쎄한데 나중에 다시 생각
   */
  public mapCreateImageDtoByCloudKey(
    cloudKeys: string[],
    type: ImageType,
    referenceModel: ReferenceModel,
    referenceId?: string,
  ): CreateImageDto {
    const createImageDto: CreateImageDto = {
      cloud_keys: cloudKeys,
      type,
      reference_model: referenceModel,
      reference_id: referenceId,
    };

    return createImageDto;
  }
}
