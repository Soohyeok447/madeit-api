import { ImageType } from "src/domain/common/enums/image.enum";
import { ReferenceId } from "src/domain/common/enums/reference_id.enum";

export class UpdateImageDto {
  public type?: ImageType;

  public reference_id?: string;

  public reference_model?: ReferenceId;

  public key?: string;

  public filenames?: string[];
}
