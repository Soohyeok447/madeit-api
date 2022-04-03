import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';
import { SignOutResponse } from '../response.index';
import { SignOutUseCaseParams } from './dtos/SignOutUseCaseParams';
import { UserAlreadySignOutException } from './exceptions/UserAlreadySignOutException';
import { SignOutUseCase } from './SignOutUseCase';

@Injectable()
export class SignOutUseCaseImpl implements SignOutUseCase {
  public constructor(private readonly _userRepository: UserRepository) {}

  public async execute({ userId }: SignOutUseCaseParams): SignOutResponse {
    const user: User = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    if (!user.refreshToken) throw new UserAlreadySignOutException();

    await this._userRepository.updateRefreshToken(user.id, null);

    return {};
  }
}
