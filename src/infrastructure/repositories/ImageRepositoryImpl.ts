import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateImageDto } from '../../domain/repositories/image/dtos/CreateImageDto';
import { UpdateImageDto } from '../../domain/repositories/image/dtos/UpdateImageDto';
import { ImageRepository } from '../../domain/repositories/image/ImageRepository';
import { ImageModel } from '../../domain/models/ImageModel';

@Injectable()
export class ImageRepositoryImpl implements ImageRepository {
  constructor(
    @InjectModel('Image')
    private readonly imageModel: Model<ImageModel>,
  ) {}

  public async create(data: CreateImageDto): Promise<ImageModel> {
    const image = await this.imageModel.create(data);

    const result = await image.save();

    return result;
  }

  public async update(id: string, data: UpdateImageDto): Promise<void> {
    await this.imageModel.findByIdAndUpdate(id, data);
  }

  public async delete(id: string): Promise<void> {
    await this.imageModel.findByIdAndDelete(id);
  }
}
