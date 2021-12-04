import { Injectable } from '@nestjs/common';
import { AuthCredentialInput, AuthCredentialOutput } from '../dto/auth_credential.dto';
import { GoogleOauthOutput } from '../dto/google_oauth.dto';
import { RefreshOutput } from '../dto/refresh.dto';
import { GoogleUserProfile } from '../../../common/types/google_sign_in.type';

@Injectable()
export abstract class AuthService {

  public abstract signIn({ email, password }: AuthCredentialInput): Promise<AuthCredentialOutput>;

  public abstract signOut(id: string): Promise<void>;

  public abstract reissueAccessToken(refreshToken: string, id: number): Promise<RefreshOutput>;

  public abstract googleSignIn(googleUserProfile: GoogleUserProfile): Promise<GoogleOauthOutput>;
}
