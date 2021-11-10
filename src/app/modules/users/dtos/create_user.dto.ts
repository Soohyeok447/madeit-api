import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public readonly username: string;

  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}
