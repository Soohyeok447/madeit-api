import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly respository: Repository<User>,
  ) {}

  public async findOne(id: number) {
    return this.respository.findOne(id);
  }
}
