import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { CommonUserService } from '../../user/common/CommonUserService';
import { SignOutResponse } from '../response.index';
import { SignOutUseCaseParams } from './dtos/SignOutUseCaseParams';
import { SignOutUseCase } from './SignOutUseCase';

@Injectable()
export class SignOutUseCaseImpl implements SignOutUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  public async execute({ userId }: SignOutUseCaseParams): SignOutResponse {
    const user = await this._userRepository.findOne(userId);

    CommonUserService.assertUserExistence(user);

    //로그인한 유저의 DB에 refreshToken갱신
    await this._userRepository.updateRefreshToken(user['_id'], null);

    return {};
  }
}
