import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner } from '../../domain/entities/Banner';
import { BannerRepository } from '../../domain/repositories/banner/BannerRepository';
import { CreateBannerDto } from '../../domain/repositories/banner/dtos/CreateBannerDto';
import { ModifyBannerDto } from '../../domain/repositories/banner/dtos/ModifyBannerDto';
import { BannerSchemaModel } from '../schemas/models/BannerSchemaModel';

@Injectable()
export class BannerRepositoryImpl implements BannerRepository {
  public constructor(
    @InjectModel('Banner')
    private readonly bannerModel: Model<BannerSchemaModel>,
  ) {}

  public async save(dto: CreateBannerDto): Promise<Banner> {
    // eslint-disable-next-line @typescript-eslint/typedef
    const newBanner = new this.bannerModel({
      title: dto.title,
      content_video_id: dto.contentVideoId,
      banner_image_id: dto.bannerImageId,
    });

    // eslint-disable-next-line @typescript-eslint/typedef
    const result = await newBanner.save();

    return new Banner(
      result.id.toString(),
      result.title,
      result.views,
      result.banner_image_id.toString(),
      result.content_video_id,
      result.created_at,
    );
  }

  public async modify(id: string, dto: ModifyBannerDto): Promise<Banner> {
    const bannerSchema: BannerSchemaModel = await this.bannerModel
      .findByIdAndUpdate(
        { _id: id },
        {
          title: dto.title,
          content_video_id: dto.contentVideoId,
          banner_image_id: dto.bannerImageId,
        },
        { runValidators: true, new: true },
      )
      .lean();

    return new Banner(
      bannerSchema._id.toString(),
      bannerSchema.title,
      bannerSchema.views,
      bannerSchema.banner_image_id.toString(),
      bannerSchema.content_video_id,
      bannerSchema.created_at,
    );
  }

  public async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async findOne(id: string): Promise<Banner> {
    const bannerSchema: BannerSchemaModel = await this.bannerModel
      .findOne({ _id: id })
      .lean();

    return new Banner(
      bannerSchema._id.toString(),
      bannerSchema.title,
      bannerSchema.views,
      bannerSchema.banner_image_id.toString(),
      bannerSchema.content_video_id,
      bannerSchema.created_at,
    );
  }

  public async findAll(): Promise<Banner[]> {
    throw new Error('Method not implemented.');
  }
}
