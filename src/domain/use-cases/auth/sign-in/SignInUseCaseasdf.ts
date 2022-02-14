import { UseCase } from '../../UseCase';
import { SignInResonse } from '../response.index';
import { SignInUseCaseParams } from './dtos/SignInUseCaseParams';

export abstract class SignInUseCase
  implements UseCase<SignInUseCaseParams, SignInResonse>
{
  abstract execute(params: SignInUseCaseParams): SignInResonse;
}
