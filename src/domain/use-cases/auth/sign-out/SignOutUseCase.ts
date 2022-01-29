import { UseCase } from '../../UseCase';
import { SignOutResponse } from '../response.index';
import { SignOutUseCaseParams } from './dtos/SignOutUseCaseParams';

export abstract class SignOutUseCase
  implements UseCase<SignOutUseCaseParams, SignOutResponse>
{
  abstract execute(params: SignOutUseCaseParams): SignOutResponse;
}
