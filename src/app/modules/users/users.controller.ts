import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { CreateUserInput } from './dtos/create_user.dto';
import { FindUserOutput } from './dtos/find_user.dto';
import { UsersService } from './interfaces/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**  
   * @deprecated  
   * 나중에 다른 기능으로 수정
   * */
  @Get('validate')
  @HttpCode(201)
  async validate(@Query('username') username: string): Promise<void> {
    // await this.usersService.validateUsername(username);

    return null;
  }

  @Get(':id')
  async findOneById(@Param('id') userId: number): Promise<FindUserOutput> {
    const { id, username, email } = await this.usersService.findOneById(userId);

    return {
      id,
      username,
      email,
    };
  }

  // @Post()
  // async create(@Body() createUserInput: CreateUserInput): Promise<void> {
  //   await this.usersService.create(createUserInput);
  // }
}
