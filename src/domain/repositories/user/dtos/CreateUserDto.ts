export class CreateUserDto {
  public user_id: string;

  public provider: string;

  public username: string;

  public age: number;

  public goal?: string;

  public status_message?: string;
}
