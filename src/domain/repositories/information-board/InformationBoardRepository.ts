import { InformationBoard } from '../../entities/InformationBoard';
import { CreateBoardDto } from './dtos/createBoardDto';
import { UpdateBoardDto } from './dtos/updateBoardDto';

export abstract class InformationBoardRepository {
  abstract create(dto: CreateBoardDto): Promise<InformationBoard | null>;

  abstract modify(
    id: string,
    dto: UpdateBoardDto,
  ): Promise<InformationBoard | null>;

  abstract findOne(id: string): Promise<InformationBoard | null>;

  abstract findAll(size: number, next?: string): Promise<InformationBoard[]>;
}
