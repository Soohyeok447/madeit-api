import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class UsersService {
  // public abstract create({ username, email, password }: CreateUserInput)

  public abstract findOneById(id: number);
}
