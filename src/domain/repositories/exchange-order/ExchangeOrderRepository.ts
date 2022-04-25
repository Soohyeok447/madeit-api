import { ExchangeOrder } from 'src/domain/entities/ExchangeOrder';

export abstract class ExchangeOrderRepository {
  public abstract findAll(): Promise<ExchangeOrder[]>;

  public abstract findAllByUserId(userId: string): Promise<ExchangeOrder[]>;

  public abstract save(userId: string, amount: number): Promise<ExchangeOrder>;

  public abstract updateState(state: string): Promise<ExchangeOrder>;
}
