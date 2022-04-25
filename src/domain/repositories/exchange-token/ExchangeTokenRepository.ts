import { ExchangeToken } from 'src/domain/entities/ExchangeToken';

export abstract class ExchangeTokenRepository {
  /**
   * The conflict algorithm should override the old one which has the same userId.
   * Thus, an user has only one instance of the exchange token.
   */
  public abstract save(userId: string, token: string): Promise<ExchangeToken>;

  public abstract findOneByUserId(
    userId: string,
  ): Promise<ExchangeToken | null>;
}
