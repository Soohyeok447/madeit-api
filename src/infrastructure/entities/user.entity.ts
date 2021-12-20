import { BaseEntity } from './common/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/domain/models/enum/gender.enum';
import { Job } from 'src/domain/models/enum/job.enum';
import { Role } from 'src/domain/models/enum/role.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  public user_id: string;

  @Column()
  @IsEmail()
  public email: string;

  @Column()
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  public username: string;

  @Column({ nullable: true })
  @IsString()
  public refresh_token?: string;

  @Column()
  @IsString()
  public provider: string;

  @Column("simple-array")
  public roles: Role[];

  @Column({default:false})
  @IsBoolean()
  public is_admin: boolean;

  @Column({ type: 'enum', enum: Gender })
  @IsEnum(Gender)
  public gender: Gender;

  @Column({ type: 'enum', enum: Job })
  @IsEnum(Job)
  public job: Job;

  @Column()
  @IsString()
  public birth: string;
}