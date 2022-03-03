import { Provider } from "../../../../enums/Provider";

export class SignUpUseCaseParams {
  provider: Provider;

  thirdPartyAccessToken: string;

  id: string;

  username: string;

  age: number;

  goal?: string;

  statusMessage?: string;
}