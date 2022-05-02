import { ObjectId } from '../../../domain/common/types';

export class CompleteRoutineSchemaModel {
  public readonly _id?: ObjectId;

  public readonly user_id?: ObjectId;

  public readonly routine_id?: ObjectId;

  public readonly created_at?: string;

  public readonly updated_at?: string;

  public readonly deleted_at?: string;
}