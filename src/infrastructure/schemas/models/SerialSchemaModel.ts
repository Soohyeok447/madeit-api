import * as mongoose from 'mongoose';

export class SerialSchemaModel {
  public readonly _id?: mongoose.Types.ObjectId;

  public readonly user_id?: mongoose.Types.ObjectId;

  public readonly email?: string;

  public readonly serial?: string;

  public readonly created_at?: string;

  public readonly updated_at?: string;

  public readonly deleted_at?: string;
}
