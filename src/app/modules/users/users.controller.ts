import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create_user.dto';
import { CreateUserResult } from './results/create.result';
import { FindUserResult } from './results/find.result';
import { UsersService } from './users.service';

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
  async findOneById(@Param('id') id: number): Promise<FindUserResult> {
    const result = await this.usersService.findOneById(id);

    return {
      id: result.id,
      username: result.username,
      email: result.email,
    };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserResult>  {
    try {
      const result = await this.usersService.create(createUserDto);

      return {
        id: result.id,
        username: result.username,
        email: result.email,
      };
    } catch(err){
      throw err;
    }
  }
}
