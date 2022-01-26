import { Injectable } from '@nestjs/common';
import { FindUserUsecaseDto } from 'src/domain/use-cases/user/use-cases/find-user/dtos/FindUserUsecaseDto';
import { DoUserOnboardingUsecaseDto } from '../../use-cases/do-user-onboarding/dtos/DoUserOnboardingUsecaseDto';
import { FindUserResponseDto } from '../../use-cases/find-user/dtos/FindUserResponseDto';
import { ModifyUserUsecaseDto } from '../../use-cases/modify-user/dtos/ModifyUserUsecaseDto';

@Injectable()
export abstract class UserService {
  /**
   * 간단 유저정보 저장
   */
  public abstract doUserOnboarding({
    id,
    birth,
    gender,
    job,
    username,
  }: DoUserOnboardingUsecaseDto): Promise<void>;

  /**
   * id로 유저를 찾음
   */
  public abstract findUser({
    id,
    resolution,
  }: FindUserUsecaseDto): Promise<FindUserResponseDto>;

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
  }: ModifyUserUsecaseDto): Promise<void>;
}
