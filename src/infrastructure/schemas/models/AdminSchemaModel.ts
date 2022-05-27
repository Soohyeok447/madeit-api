import * as mongoose from 'mongoose';

export class AdminSchemaModel {
  public readonly _id?: mongoose.Types.ObjectId;

  public readonly identifier?: string;

  public readonly password?: string;
}
