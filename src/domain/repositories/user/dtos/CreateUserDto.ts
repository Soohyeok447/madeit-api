import { Provider } from '../../../use-cases/auth/common/types/provider';

export class CreateUserDto {
  public userId: string;

  public provider: Provider;

  public username: string;

  public age: number;

  public goal?: string;

  public statusMessage?: string;
}
