import { ObjectId } from '../../../domain/common/types';

export class CartSchemaModel {
  public readonly _id: ObjectId;

  public readonly user_id: ObjectId;

  public readonly recommended_routine_id: ObjectId;
}
