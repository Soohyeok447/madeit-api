import { Injectable } from '@nestjs/common';
import { FindUserInput } from 'src/domain/users/use-cases/find-user/dtos/find_user.input';
import { DoUserOnboardingInput } from '../../use-cases/do-user-onboarding/dtos/do_user_onboarding.input';
import { FindUserOutput } from '../../use-cases/find-user/dtos/find_user.output';
import { ModifyUserInput } from '../../use-cases/modify-user/dtos/modify_user.input';

@Injectable()
export abstract class UsersService {
  /**
   * 간단 유저정보 저장
   */
  public abstract doUserOnboarding({
    id,
    birth,
    gender,
    job,
    username,
  }: DoUserOnboardingInput): Promise<void>;

  /**
   * id로 유저를 찾음
   */
  public abstract findUser({ id, resolution }: FindUserInput): Promise<FindUserOutput>;


  /**
   * 유저 정보 수정
   * 
   * 프로필 사진 수정, 삭제 가능
   */
  public abstract modifyUser({ 
    id, 
    profile,
    username,
    birth,
    job,
    gender, 
  }: ModifyUserInput): Promise<void>;
}
