/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReferenceType } from '../../../domain/common/enums/ReferenceType';
import { Resolution } from '../../../domain/common/enums/Resolution';
import { s3 } from '../../config/s3';
import { getS3BucketName } from '../../environment';
import { DeleteObjectToS3Error } from './errors/DeleteObjectFromS3Error';
import { DirectoryMapper, s3Params } from './directory-mapper/DirectoryMapper';
import { DirectoryMapperFactory } from './directory-mapper/DirectoryMapperFactory';
import { Injectable } from '@nestjs/common';
import { PutObjectToS3Error } from './errors/PutObjectToS3Error';

export type CloudKey = string;

@Injectable()
export class S3Storage {
  constructor(
    private readonly _directoryMapperFactory: DirectoryMapperFactory,
  ) {}

  public putObject(
    imageFile: Express.Multer.File,
    imageType: ReferenceType,
    prefix: string,
  ): CloudKey {
    if (!imageFile) return;

    const s3Handler: DirectoryMapper =
      this._directoryMapperFactory.create(imageType);

    const params: s3Params = s3Handler.getParamsToPutS3Object(
      imageFile,
      prefix,
    );

    try {
      const result = s3.putObject(params, (_, __) => null);

      const splittedResult =
        result['response']['request']['params']['Key'].split('/');

      splittedResult.shift();

      const cloudKey = splittedResult.join('/');
      //s3 key
      return cloudKey;
    } catch (err) {
      throw new PutObjectToS3Error();
    }
  }

  public deleteObject(cloudKey: string): void {
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
}
