import { Provider } from '../../common/types/provider';

export class SignUpUseCaseParams {
  provider: Provider;

  thirdPartyAccessToken: string;

  username: string;

  age: number;

  goal?: string;

  statusMessage?: string;
}
