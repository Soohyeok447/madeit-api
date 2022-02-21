import { UseCase } from '../../UseCase';

/**
 * 간단 유저정보 저장
 */
export abstract class ValidateUsernameUseCase<Params, Response>
  implements UseCase<Params, Response>
{
  abstract execute(
    params: Params,
  ): Response;
}
