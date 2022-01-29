import { UserModel } from "../../../../domain/models/UserModel";

export abstract class AuthCommonService {

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