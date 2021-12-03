import { Injectable } from '@nestjs/common';
import { AuthCredentialInput, AuthCredentialOutput } from '../dto/auth_credential.dto';
import { RefreshOutput } from '../dto/refresh.dto';

@Injectable()
export abstract class AuthService {

  public abstract signIn({ email, password }: AuthCredentialInput): Promise<AuthCredentialOutput>

  public abstract signOut(id: string): Promise<void>

  public abstract reissueAccessToken(refreshToken: string, id: number): Promise<RefreshOutput>
}


