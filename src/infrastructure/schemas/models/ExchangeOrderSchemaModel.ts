import { ObjectId } from '../../../domain/common/types';

export class ExchangeOrderSchemaModel {
  public readonly _id?: ObjectId;

  public readonly user_id?: ObjectId;

  public readonly amount?: number;

  public readonly bank?: string;

  public readonly account?: string;

  public readonly state?: string;

  public readonly created_at?: string;

  public readonly updated_at?: string;

  public readonly deleted_at?: string;
}
