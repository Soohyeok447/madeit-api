export class ModifyUserUsecaseParams {
  public readonly id: string; // this is primary key in user table got from user decorator

  public readonly username?: string;

  public readonly age?: number;

  public readonly goal?: string;

  public readonly statusMessage?: string;
}
