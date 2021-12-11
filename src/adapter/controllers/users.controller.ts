import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { FindUserResponse } from '../dto/user/find_user.response';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**  
   * @deprecated  
   * 나중에 다른 기능으로 수정
   * */
  @Get('validate')
  async validate(@Query('username') username: string): Promise<void> {
    // await this.usersService.validateUsername(username);

    return null;
  }

  @Get(':id')
  async findOneById(@Param('id') userId: number): Promise<FindUserResponse> {
    const { id, username, email } = await this.usersService.findOneById(userId);

    return {
      id,
      username,
      email,
    };
  }
}
