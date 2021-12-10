import { Injectable } from '@nestjs/common';
import { GoogleOauthDto } from '../dto/google_oauth.dto';
import { GoogleOauthInput } from '../dto/google_oauth.input';
import { RefreshDto } from '../dto/refresh.dto';

@Injectable()
export abstract class AuthService {

  public abstract googleAuth(googleOauthInput: GoogleOauthInput): Promise<GoogleOauthDto>;

  public abstract reissueAccessToken(refreshToken: string, id: number): Promise<RefreshDto>;

  public abstract signOut(id: string): Promise<void>;
}
