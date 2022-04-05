export abstract class HashProvider {
  public abstract hash(data: string): Promise<string>;

  public abstract compare(data: string, encrypted: string): Promise<boolean>;
}
