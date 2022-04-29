export class CreateExchangeOrderDto {
  public readonly userId: string;

  public readonly amount: number;

  public readonly bank: string;

  public readonly account: string;
}
