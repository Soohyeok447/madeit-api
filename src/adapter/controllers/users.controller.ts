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
  async doUserOnboarding(@User() user, @Body() doUserOnboardingRequest: DoUserOnboardingRequest ): Promise<void> {
    const doUserOnboardingInput: DoUserOnboardingInput = {
      id: user.id,
      ...doUserOnboardingRequest
    }
    
    await this.usersService.doUserOnboarding(doUserOnboardingInput);
  }

  // @Get(':id')
  // async findOneById(@Param('id') userId: number): Promise<FindUserResponse> {
  //   const { id, username, email } = await this.usersService.findOneById(userId);

  //   return {
  //     id,
  //     username,
  //     email,
  //   };
  // }
}
