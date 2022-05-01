import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateImageDto } from '../../domain/repositories/image/dtos/CreateImageDto';
import { UpdateImageDto } from '../../domain/repositories/image/dtos/UpdateImageDto';
import { ImageRepository } from '../../domain/repositories/image/ImageRepository';
import { ImageModel } from '../../domain/models/ImageModel';
import { ObjectId } from '../../domain/common/types';
import * as moment from 'moment';
moment.locale('ko');

@Injectable()
export class ImageRepositoryImpl implements ImageRepository {
  public constructor(
    @InjectModel('Image')
    private readonly imageModel: Model<ImageModel>,
  ) {}

  public async create(data: CreateImageDto): Promise<ImageModel> {
    const image: any = await this.imageModel.create(data);

    const result: any = await image.save();

    return result;
  }

  public async update(id: string, data: UpdateImageDto): Promise<ImageModel> {
    const result: ImageModel = await this.imageModel
      .findByIdAndUpdate(
        id,
        {
          updated_at: moment().format(),
          ...data,
        },
        { runValidators: true, new: true },
      )
      .lean();

    return result;
  }

  public async delete(id: string): Promise<void> {
    await this.imageModel.findByIdAndUpdate(id, {
      deleted_at: moment().format(),
    });
  }

  public async findOne(id: string | ObjectId): Promise<ImageModel> {
    const image: ImageModel = await this.imageModel.findById(id).lean();

    return image;
  }

  public async findOneByUserId(userId: string): Promise<ImageModel> {
    const image: ImageModel = await this.imageModel
      .findOne({ referenceId: userId })
      .lean();

    return image;
  }
}
