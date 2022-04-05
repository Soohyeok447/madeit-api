import { Provider } from '../../common/types/provider';

export class SignUpUseCaseParams {
  public readonly provider: Provider;

  public readonly thirdPartyAccessToken: string;

  public readonly username: string;

  public readonly age: number;

  public readonly goal?: string;

  public readonly statusMessage?: string;
}
