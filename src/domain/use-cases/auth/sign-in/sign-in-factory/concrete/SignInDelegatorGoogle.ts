import { UserModel } from '../../../../../models/UserModel';
import { GoogleAuthProvider } from '../../../../../providers/GoogleAuthProvider';
import { UserRepository } from '../../../../../repositories/user/UserRepository';
import { CommonAuthService } from '../../../service/CommonAuthService';
import { SignInResponseDto } from '../../dtos/SignInResponseDto';
import { GoogleEmailNotVerifiedException } from '../../exceptions/google/GoogleEmailNotVerifiedException';
import { GoogleInvalidTokenException } from '../../exceptions/google/GoogleInvalidTokenException';
import { payload, SignInDelegator, userId } from '../SignInDelegator';

export class SignInDelegatorGoogle extends SignInDelegator {
  constructor(
    private _token: string,
    private readonly _googleAuthProvider: GoogleAuthProvider,
    private readonly _userRepository: UserRepository,
    private readonly _authService: CommonAuthService,
  ) {
    super();
  }

  async verifyToken(): Promise<payload> {
    const client = this._googleAuthProvider.getGoogleClient(
      process.env.GOOGLE_CLIENT,
    );

    let ticket;
    let payload;

    try {
      ticket = await client.verifyIdToken({
        idToken: this._token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      payload = ticket.getPayload();
    } catch (err) {
      throw new GoogleInvalidTokenException();
    }

    return payload;
  }

  async getUserIdByPayload(payload): Promise<userId> {
    const { email_verified, sub, azp } = payload;

    //Issuer assert
    if (azp != process.env.GOOGLE_CLIENT_ID_ANDROID) {
      throw new GoogleInvalidTokenException();
    }

    if (!email_verified) {
      throw new GoogleEmailNotVerifiedException();
    }

    const userId = sub;

    return userId;
  }

  async createOrFindUserByExistence(userId: string): Promise<UserModel> {
    let user: UserModel = await this._userRepository.findOneByUserId(userId);

    if (!user) {
      user = await this._authService.createTemporaryUser({
        userId,
        provider: 'google',
      });
    }

    return user;
  }

  async issueToken(user: UserModel): Promise<SignInResponseDto> {
    return await this._authService.issueAccessTokenAndRefreshToken(user);
  }
}
