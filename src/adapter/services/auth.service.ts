import { Injectable } from '@nestjs/common';
import { GoogleAuthOutput } from 'src/domain/dto/auth/google_auth.output';
import { ReissueAccessTokenInput } from 'src/domain/dto/auth/reissue_accesstoken.input';
import { ReissueAccessTokenOutput } from 'src/domain/dto/auth/reissue_accesstoken.output';
import { GoogleAuthInput } from '../../domain/dto/auth/google_auth.input';
@Injectable()
export abstract class AuthService {

  public abstract googleAuth(googleAuthInput: GoogleAuthInput): Promise<GoogleAuthOutput>;

  public abstract reissueAccessToken(reissueAccessTokenInput: ReissueAccessTokenInput): Promise<ReissueAccessTokenOutput>;

  public abstract signOut(id: number): Promise<void>;
}
