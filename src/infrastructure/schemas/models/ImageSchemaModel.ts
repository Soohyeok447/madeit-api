import { ReferenceType } from '../../../domain/common/enums/ReferenceType';

export class ImageSchemaModel {
  readonly _id?: string;

  readonly reference_id?: string;

  readonly reference_type?: ReferenceType;

  readonly prefix?: string;

  readonly filenames?: string[];

  readonly cloud_keys?: string[];
}
