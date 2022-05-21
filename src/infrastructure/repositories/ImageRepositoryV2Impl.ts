import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { ImageRepositoryV2 } from '../../domain/repositories/imageV2/ImageRepositoryV2';
import { ImageV2SchemaModel } from '../schemas/models/ImageV2SchemaModel';
import { ImageV2 } from '../../domain/entities/ImageV2';
moment.locale('ko');

import { v4 } from 'uuid';
import * as sharp from 'sharp';
import * as AWS from 'aws-sdk';
import { LoggerProvider } from '../../domain/providers/LoggerProvider';

const S3: AWS.S3 = new AWS.S3();

const resolutions: {
  name: string;
  width: number;
}[] = [
  { name: 'HD', width: 720 }, // 720  * 1280
  { name: 'FHD', width: 1080 }, // 1080 * 1920
  { name: 'QHD', width: 1440 }, // 1440 * 2560
  { name: 'UHD', width: 2160 }, // 2160 * 3840
];

@Injectable()
export class ImageRepositoryV2Impl implements ImageRepositoryV2 {
  public constructor(
    @InjectModel('ImagesV2')
    private readonly imageV2Model: Model<ImageV2SchemaModel>,
    private readonly loggerProvider: LoggerProvider,
  ) {}

  public async save(dto: {
    buffer: Buffer;
    mimetype: string;
    description?: string;
  }): Promise<ImageV2> {
    const uuid: string = v4();

    resolutions.map(async (resolution) => {
      const buffer: Buffer = await sharp(dto.buffer)
        .webp()
        .resize({ width: resolution.width })
        .toBuffer();

      const params: {
        Bucket: any;
        Key: string;
        Body: Buffer;
        ContentType: string;
      } = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${uuid}/${resolution.name}`,
        Body: buffer,
        ContentType: 'image',
      };

      S3.putObject(params).promise();
    });

    // eslint-disable-next-line @typescript-eslint/typedef
    const newImage = new this.imageV2Model({
      uuid,
      mimetype: dto.mimetype,
      description: dto.description,
    });

    // eslint-disable-next-line @typescript-eslint/typedef
    const result = await newImage.save();

    return new ImageV2(
      result.id,
      result.uuid,
      result.mimetype,
      result.created_at,
    );
  }

  public delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async findOne(id: string): Promise<ImageV2> {
    const bannerModel: ImageV2SchemaModel = await this.imageV2Model
      .findById(id)
      .lean();

    const banner: ImageV2 = new ImageV2(
      bannerModel._id,
      bannerModel.uuid,
      bannerModel.mimetype,
      bannerModel.created_at,
    );

    return banner;
  }
}
