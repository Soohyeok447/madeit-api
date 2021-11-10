import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create_user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly respository: Repository<User>,
  ) {}

  public async create(dto: CreateUserDto) {
    const { username, email, password } = dto;

    await this.validateEmail(email);

    await this.validateUsername(username);

    await this.validatePassword(password);

    const newOne = this.respository.create(dto);

    return this.respository.save(newOne);
  }

  private async validateEmail(value: string) {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regex.test(value.toLowerCase())) {
      throw new BadRequestException('유효하지 않은 이메일 형식입니다.');
    }

    const user = await this.findOneByEmail(value);

    if (user) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }
  }

  public async validateUsername(value: string) {
    if (value.length < 2) {
      throw new BadRequestException('이름은 2자 이상이어야 합니다.');
    }

    if (value.length > 8) {
      throw new BadRequestException('이름은 8자 이하여야 합니다.');
    }

    const user = await this.findOneByUsername(value);

    if (user) {
      throw new ConflictException('이미 존재하는 이름입니다.');
    }
  }

  private async validatePassword(value: string) {
    if (value.length < 8) {
      throw new BadRequestException('비밀번호는 8자 이상이어야 합니다.');
    }

    if (value.length > 20) {
      throw new BadRequestException('비밀번호는 20자 이하여야 합니다.');
    }

    const regex = /^[a-zA-Z0-9]{8,20}$/;

    if (!regex.test(value)) {
      throw new BadRequestException(
        '비밀번호는 영문과 숫자를 혼합하여야 합니다.',
      );
    }
  }

  public async findOne(id: number) {
    return this.respository.findOne(id);
  }

  public async findOneByEmail(email: string) {
    return this.respository.findOne({ where: { email } });
  }

  public async findOneByUsername(username: string) {
    return this.respository.findOne({ where: { username } });
  }

  public async cleanUp() {
    return this.respository.createQueryBuilder().delete().from(User).execute();
  }
}
