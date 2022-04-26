export class ExchangeOrder {
  public constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly bank: string,
    public readonly account: string,
    public readonly state: string,
  ) {}
}
