import { Image } from "../../models/image.model";
import { CreateImageDto } from "./dtos/create.dto";
import { UpdateImageDto } from "./dtos/update.dto";


export abstract class ImageRepository {
  abstract create(data: CreateImageDto): Promise<Image>;

  abstract update(id: string, data: UpdateImageDto): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
