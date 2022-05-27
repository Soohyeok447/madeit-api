import * as mongoose from 'mongoose';

export class CartSchemaModel {
  public readonly _id: mongoose.Types.ObjectId;

  public readonly user_id: mongoose.Types.ObjectId;

  public readonly recommended_routine_id: mongoose.Types.ObjectId;

  public readonly created_at?: string;

  public readonly updated_at?: string;

  public readonly deleted_at?: string;
}
