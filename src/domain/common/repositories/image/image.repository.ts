import { CreateImageDto } from "./dtos/create.dto";
import { UpdateImageDto } from "./dtos/update.dto";


export abstract class ImageRepository {
  abstract create(data: CreateImageDto): Promise<void>;

  abstract update(id: string, data: UpdateImageDto): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
