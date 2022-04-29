import { ObjectId } from '../../../domain/common/types';

export class SerialSchemaModel {
  public readonly _id?: ObjectId;

  public readonly user_id?: ObjectId;

  public readonly email?: string;

  public readonly serial?: string;

  public readonly created_at?: string;
}
