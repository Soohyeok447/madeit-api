import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Image } from "src/domain/common/models/image.model";
import { CreateImageDto } from "src/domain/common/repositories/image/dtos/create.dto";
import { UpdateImageDto } from "src/domain/common/repositories/image/dtos/update.dto";
import { ImageRepository } from "src/domain/common/repositories/image/image.repository";

@Injectable()
export class ImageRepositoryImpl implements ImageRepository{
  constructor(
    @InjectModel('Image')
    private readonly imageModel: Model<Image>,
  ) {}
  
  public async create(data: CreateImageDto): Promise<Image> {
    const image = await this.imageModel.create(data);

    const result = await image.save();

    return result;
  }

  public async update(id: string, data: UpdateImageDto): Promise<void> {
    await this.imageModel.findByIdAndUpdate(id,data);
  }
  
  public async delete(id: string): Promise<void> {
    await this.imageModel.findByIdAndDelete(id);
  }

}