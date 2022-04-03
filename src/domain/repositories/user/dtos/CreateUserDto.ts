import { Provider } from '../../../use-cases/auth/common/types/provider';

export class CreateUserDto {
  public readonly userId: string;

  public readonly provider: Provider;

  public readonly username: string;

  public readonly age: number;

  public readonly goal?: string;

  public readonly statusMessage?: string;
}
