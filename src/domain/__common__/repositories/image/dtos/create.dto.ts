import { ImageType } from "src/domain/__common__/enums/image.enum";
import { ReferenceId } from "src/domain/__common__/enums/reference_id.enum";

export class CreateImageDto {
  public type: ImageType;

  public reference_id?: string;

  public reference_model: ReferenceId;

  public key: string;

  public filenames: string[];
}
