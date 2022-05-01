import { PointHistory } from '../../entities/PointHistory';

export abstract class PointHistoryRepository {
  public abstract save(
    userId: string,
    message: string,
    point: number,
  ): Promise<PointHistory>;

  public abstract findAllByUserId(userId: string): Promise<PointHistory[]>;

  public abstract findAll(): Promise<PointHistory[]>;
}
