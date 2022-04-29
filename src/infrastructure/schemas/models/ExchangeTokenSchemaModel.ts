import { ObjectId } from '../../../domain/common/types';

export class ExchangeTokenSchemaModel {
  public readonly _id?: ObjectId;

  public readonly user_id?: ObjectId;

  public readonly token?: string;

  public readonly created_at?: string;
}
