import { ObjectId } from '../../../domain/common/types';

export class PointHistorySchemaModel {
  public readonly _id?: ObjectId;

  public readonly user_id?: ObjectId;

  public readonly message?: string;

  public readonly point?: number;

  public readonly created_at?: string;

  public readonly updated_at?: string;

  public readonly deleted_at?: string;
}
