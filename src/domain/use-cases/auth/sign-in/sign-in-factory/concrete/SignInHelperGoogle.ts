import { Role } from "src/domain/enums/Role";
import { UserModel } from "../../../../../models/UserModel";
import { GoogleAuthProvider } from "../../../../../providers/GoogleAuthProvider";
import { CreateUserDto } from "../../../../../repositories/user/dtos/CreateUserDto";
import { UserRepository } from "src/domain/repositories/user/UserRepository";
import { AuthCommonService } from "../../../service/AuthCommonService";
import { SignInResponseDto } from "../../dtos/SignInResponseDto";
import { GoogleEmailNotVerifiedException } from "../../exceptions/google/GoogleEmailNotVerifiedException";
import { GoogleInvalidTokenException } from "../../exceptions/google/GoogleInvalidTokenException";
import { SignInHelper, userId } from "../SignInHelper";

export class SignInHelperGoogle extends SignInHelper {
  constructor(
    private _token: string,
    private readonly _googleAuthProvider: GoogleAuthProvider,
    private readonly _userRepository: UserRepository,
    private readonly _authService: AuthCommonService,
  ) {
    super();
  }

  async verifyToken(): Promise<userId> {
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
