import { ExchangeOrder } from 'src/domain/entities/ExchangeOrder';

export abstract class ExchangeOrderRepository {
  public abstract findAll(): Promise<ExchangeOrder[]>;

  public abstract findAllByUserId(userId: string): Promise<ExchangeOrder[]>;

  public abstract save(dto: {
    userId: string;
    amount: number;
    bank: string;
    account: string;
  }): Promise<ExchangeOrder>;

  public abstract updateState(
    orderId: string,
    state: string,
  ): Promise<ExchangeOrder>;
}
