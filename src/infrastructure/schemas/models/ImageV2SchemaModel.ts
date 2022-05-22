import * as mongoose from 'mongoose';

export class ImageV2SchemaModel {
  public readonly _id?: mongoose.Types.ObjectId;

  public readonly uuid?: string;

  public readonly mimetype?: string;

  public readonly description?: string;

  public readonly created_at?: string;
}
