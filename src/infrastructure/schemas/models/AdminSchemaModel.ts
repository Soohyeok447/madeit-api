import { ObjectId } from '../../../domain/common/types';

export class AdminSchemaModel {
  public readonly _id?: ObjectId;

  public readonly identifier?: string;

  public readonly password?: string;
}
