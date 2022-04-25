export class ExchangeOrder {
  public constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly state: string,
  ) {}
}
