import BaseEntity from './base';
import { Column, Entity } from 'typeorm';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/domain/models/enum/gender.enum';
import { Job } from 'src/domain/models/enum/job.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  public user_id: string;

  @Column({ nullable: true })
  @IsEmail()
  public email?: string;

  @Column()
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  public username?: string;

  @Column({ nullable: true })
  @IsString()
  public refresh_token?: string;

  @Column({ nullable: true, type: 'enum', enum: Gender })
  @IsEnum(Gender)
  public gender?: Gender;

  @Column({ nullable: true, type: 'enum', enum: Job })
  @IsEnum(Job)
  public job?: Job;

  @Column({ nullable: true })
  @IsString()
  public birth?: string;

  @Column()
  @IsString()
  public provider: string;
}
