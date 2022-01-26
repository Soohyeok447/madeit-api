import { UpdateUserDto } from "../../../../repositories/user/dtos/UpdateUserDto";
import { DoUserOnboardingUseCaseDto } from "./dtos/DoUserOnboardingUseCaseDto";
import { InvalidUsernameException } from "./exceptions/InvalidUsernameException";
import { UsernameConflictException } from "./exceptions/UsernameConflictException";
import { UseCase } from "../../../../../domain/use-cases/UseCase";
import { UserRepository } from "../../../../../domain/repositories/user/UserRepository";
import { DoUserOnboardingResponse } from "../../response.index";

  /**
   * 간단 유저정보 저장
   */

export class DoUserOnboardingUseCase implements UseCase<DoUserOnboardingUseCaseDto, DoUserOnboardingResponse>{
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  public async execute({
    id,
    birth,
    gender,
    job,
    username,
  }: DoUserOnboardingUseCaseDto): DoUserOnboardingResponse {
    const assertResult = await this.userRepository.findOneByUsername(username);

    if (assertResult) {
      throw new UsernameConflictException();
    }

    if (username.length < 2 || username.length > 8) {
      throw new InvalidUsernameException();
    }

    const onboardingData: UpdateUserDto = {
      birth,
      gender,
      job,
      username,
    };

    await this.userRepository.update(id, onboardingData);
  }
}