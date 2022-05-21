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
import { Injectable } from '@nestjs/common';
import { ImageRepository } from '../../domain/repositories/image/ImageRepository';
import { LoggerProvider } from '../../domain/providers/LoggerProvider';
import { ImageProviderV2 } from '../../domain/providers/ImageProviderV2';
import { ImageRepositoryV2 } from '../../domain/repositories/imageV2/ImageRepositoryV2';
import { ImageV2 } from '../../domain/entities/ImageV2';

@Injectable()
export class ImageProviderV2Impl implements ImageProviderV2 {
  public constructor(private readonly imageRepositoryV2: ImageRepositoryV2) {}

  public async getImageUrl(id: string): Promise<string> {
    const image: ImageV2 = await this.imageRepositoryV2.findOne(id);

    return `${process.env.AWS_CLOUDFRONT_URL}/${image.uuid}`;
  }
}
