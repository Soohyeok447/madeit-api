import { Provider } from '../../common/types/provider';

export class SignInUseCaseParams {
  thirdPartyAccessToken: string;

  provider: Provider;
}
