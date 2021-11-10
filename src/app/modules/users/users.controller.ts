import { Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create_user.dto';
import { CreateUserResult } from './results/create.result';
import { FindUserResult } from './results/find.result';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('validate')
  @HttpCode(201)
  async validate(@Query('username') username: string): Promise<void> {
    await this.service.validateUsername(username);

    return null;
  }

  @Post()
  async findOne(@Param('id') id: number): Promise<FindUserResult> {
    const result = await this.service.findOne(id);

    return {
      id: result.id,
      username: result.username,
      email: result.email,
    };
  }

  @Post()
  async create(dto: CreateUserDto): Promise<CreateUserResult> {
    const result = await this.service.create(dto);

    return {
      id: result.id,
      username: result.username,
      email: result.email,
    };
  }
}
