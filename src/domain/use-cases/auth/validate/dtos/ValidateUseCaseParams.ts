import { Provider } from '../../common/types/provider';

export class ValidateUseCaseParams {
  public readonly thirdPartyAccessToken: string;

  public readonly provider: Provider;
}
