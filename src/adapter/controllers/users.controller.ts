import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DoUserOnboardingInput } from 'src/domain/dto/user/do_user_onboarding.input';
import { FindUserInput } from 'src/domain/dto/user/find_user.input';
import { UsersService } from 'src/domain/services/interfaces/users.service';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { DoUserOnboardingRequest } from '../dto/user/do_user_onboarding.request';
import { FindUserResponse } from '../dto/user/find_user.response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('onboard')
  @UseGuards(JwtAuthGuard)
  async doUserOnboarding(
    @User() user,
    @Body() doUserOnboardingRequest: DoUserOnboardingRequest,
  ): Promise<void> {
    const input: DoUserOnboardingInput = {
      id: user.id,
      ...doUserOnboardingRequest,
    };

    await this.usersService.doUserOnboarding(input);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findUser(@User() user): Promise<FindUserResponse> {
    const input: FindUserInput = {
      id: user.id,
    };

    const { birth, username, email, provider, gender, job } =
      await this.usersService.findUser(input);

    const response = {
      birth,
      username,
      email,
      provider,
      gender,
      job,
    };

    return response;
  }
}
