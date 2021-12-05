import BaseEntity from '../../../../app/common/entities/base';
import { Column, Entity } from 'typeorm';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsEmail()
  public email: string;

  @Column()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/, {
    message: '비밀번호는 영문과 숫자를 혼합하여야 합니다.'
  })
  public password: string;

  @Column()
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  public username: string;

  @Column({ nullable: true })
  @IsString()
  public refreshToken?: string;

  @Column()
  @IsString()
  public provider: string;
}
