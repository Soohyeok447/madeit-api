import { Injectable } from '@nestjs/common';
import { GoogleAuthInput } from '../../app/modules/auth/dto/google_auth.input';
import { GoogleAuthOutput } from '../../app/modules/auth/dto/google_auth.output';
import { ReissueAccessTokenInput } from '../../app/modules/auth/dto/reissue_accesstoken.input';
import { ReissueAccessTokenOutput } from '../../app/modules/auth/dto/reissue_accesstoken.output';

@Injectable()
export abstract class AuthService {

  public abstract googleAuth(googleAuthInput: GoogleAuthInput): Promise<GoogleAuthOutput>;

  public abstract reissueAccessToken(reissueAccessTokenInput: ReissueAccessTokenInput): Promise<ReissueAccessTokenOutput>;

  public abstract signOut(id: string): Promise<void>;
}
