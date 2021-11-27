import BaseEntity from '../../../../app/common/entities/base';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({unique: true})
  public email: string;

  @Column()
  public password: string;

  @Column()
  public username: string;

  @Column({ nullable: true })
  public refreshToken: string;
}