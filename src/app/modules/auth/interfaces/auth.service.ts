import { Injectable } from '@nestjs/common';
import { GoogleOauthInput } from '../dto/google_oauth.dto';

@Injectable()
export abstract class AuthService {
  
  public abstract googleAuth(googleOauthInput: GoogleOauthInput);
  
  public abstract reissueAccessToken(refreshToken: string, id: number);
  
  public abstract signOut(id: string);
}
