import { Provider } from '../../common/types/provider';

export class SignInUseCaseParams {
  public readonly thirdPartyAccessToken: string;

  public readonly provider: Provider;
}
