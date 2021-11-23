import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  public readonly username: string;

  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,{
    message:'비밀번호는 영문과 숫자를 혼합하여야 합니다.'
  })
  public readonly password: string;
}
