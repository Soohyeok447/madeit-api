import { Injectable } from '@nestjs/common';
import { GoogleAuthInput } from '../dto/google_auth.input';
import { GoogleAuthOutput } from '../dto/google_auth.output';
import { ReissueAccessTokenInput } from '../dto/reissue_accesstoken.input';
import { ReissueAccessTokenOutput } from '../dto/reissue_accesstoken.output';

@Injectable()
export abstract class AuthService {

  public abstract googleAuth(googleAuthInput: GoogleAuthInput): Promise<GoogleAuthOutput>;

  public abstract reissueAccessToken(reissueAccessTokenInput: ReissueAccessTokenInput): Promise<ReissueAccessTokenOutput>;

  public abstract signOut(id: string): Promise<void>;
}
