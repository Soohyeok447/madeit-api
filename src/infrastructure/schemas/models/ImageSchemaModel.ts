import { ReferenceType } from '../../../domain/common/enums/ReferenceType';

export class ImageSchemaModel {
  public readonly _id?: string;

  public readonly reference_id?: string;

  public readonly reference_type?: ReferenceType;

  public readonly prefix?: string;

  public readonly filenames?: string[];

  public readonly cloud_keys?: string[];
}
