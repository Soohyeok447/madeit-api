import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './../dtos/create_user.dto';

@Injectable()
export abstract class UsersService {

  public abstract create({ username, email, password }: CreateUserInput) 
  
  public abstract findOneById(id: number)
}