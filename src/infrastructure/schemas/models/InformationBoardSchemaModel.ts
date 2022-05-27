import * as mongoose from 'mongoose';

export class InformationBoardSchemaModel {
  public readonly _id?: mongoose.Types.ObjectId;

  public readonly title?: string;

  public readonly views?: number;

  public readonly cardnews_id?: mongoose.Types.ObjectId;

  public readonly created_at?: string;

  public readonly updated_at?: string;

  public readonly deleted_at?: string;
}
