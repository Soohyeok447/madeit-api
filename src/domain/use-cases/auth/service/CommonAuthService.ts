import { UserModel } from '../../../models/UserModel';

export abstract class CommonAuthService {
  abstract createTemporaryUser({
    userId,
    provider,
  }: {
    userId: string;
    provider: string;
  });

  abstract issueAccessTokenAndRefreshToken(user: UserModel);

  abstract createTokenPairs(id: string);

  abstract createNewRefreshToken(id: string): string;

  abstract createNewAccessToken(id: string): string;

  abstract assertUserExistence(user): void;
}
