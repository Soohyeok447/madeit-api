import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExchangeAuthProvider } from 'src/domain/providers/ExchangeAuthProvider';

@Injectable()
export class ExchangeAuthProviderImpl implements ExchangeAuthProvider {
  public constructor(public jwtService: JwtService) {}

  public async issue(userId: string): Promise<string> {
    return this.jwtService.sign({
      subject: userId,
      secret: process.env.JWT_EXCHANGE_TOKEN_SECRET,
      expiresIn: process.env.JWT_EXCHANGE_TOKEN_EXPIRATION_TIME,
      issuer: process.env.JWT_ISSUER,
    });
  }

  public async verify(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token, {
        secret: process.env.JWT_EXCHANGE_TOKEN_SECRET,
        issuer: process.env.JWT_ISSUER,
      });

      return true;
    } catch {
      return false;
    }
  }
}
