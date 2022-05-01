import { ObjectId } from '../../../domain/common/types';

export class InformationBoardSchemaModel {
  public readonly _id?: ObjectId;

  public readonly title?: string;

  public readonly views?: number;

  public readonly cardnews_id?: ObjectId;

  public readonly created_at?: string;

  public readonly updated_at?: string;

  public readonly deleted_at?: string;
}
