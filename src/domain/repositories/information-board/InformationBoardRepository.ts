import { InformationBoard } from '../../entities/InformationBoard';
import { CreateBoardDto } from './dtos/CreateBoardDto';
import { UpdateBoardDto } from './dtos/UpdateBoardDto';

export abstract class InformationBoardRepository {
  public abstract create(dto: CreateBoardDto): Promise<InformationBoard | null>;

  public abstract modify(
    id: string,
    dto: UpdateBoardDto,
  ): Promise<InformationBoard | null>;

  public abstract findOne(id: string): Promise<InformationBoard | null>;

  public abstract findAll(
    size: number,
    next?: string,
  ): Promise<InformationBoard[]>;
}
