import * as mongoose from 'mongoose';

export class PointHistorySchemaModel {
  public readonly _id?: mongoose.Types.ObjectId;

  public readonly user_id?: mongoose.Types.ObjectId;

  public readonly message?: string;

  public readonly point?: number;

  public readonly created_at?: string;

  public readonly updated_at?: string;

  public readonly deleted_at?: string;
}
