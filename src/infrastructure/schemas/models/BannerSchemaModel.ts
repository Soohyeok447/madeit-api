import * as mongoose from 'mongoose';

export class BannerSchemaModel {
  public readonly _id: mongoose.Types.ObjectId;

  public readonly title: string;

  public readonly content_video_id: string;

  public readonly banner_image_id: mongoose.Types.ObjectId;

  public readonly views: number;

  public readonly created_at?: string;
}
