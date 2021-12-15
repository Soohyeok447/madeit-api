export class CreateUserDto {
  public user_id: string;

  public email?: string;

  public username?: string;

  public gender?: string;

  public birth?: string;

  public job?: string;

  public provider: string;
}
