import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AdminAuthProvider,
  Payload,
} from '../../domain/providers/AdminAuthProvider';
import { HashProvider } from '../../domain/providers/HashProvider';
import { AdminRepository } from '../../domain/repositories/admin/AdminRepository';

@Injectable()
export class AdminAuthProviderImpl implements AdminAuthProvider {
  public constructor(
    private readonly _adminRepository: AdminRepository,
    private readonly _hashProvider: HashProvider,
    private readonly jwtService: JwtService,
  ) {}

  public verifyRefreshToken(token: string): Payload {
    try {
      const result: any = this.jwtService.verify(token, {
        secret: process.env.JWT_ADMIN_REFRESH_TOKEN_SECRET,
        issuer: process.env.JWT_ISSUER,
      });

      return result;
    } catch {
      return null;
    }
  }

  public verifyAccessToken(token: string): Payload {
    try {
      const result: any = this.jwtService.verify(token, {
        secret: process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET,
        issuer: process.env.JWT_ISSUER,
      });

      return result;
    } catch {
      return null;
    }
  }

  public issueAccessToken(identifier: string): string {
    return this.jwtService.sign(
      { id: identifier },
      {
        secret: process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.JWT_ADMIN_ACCESS_TOKEN_EXPIRATION_TIME,
        issuer: process.env.JWT_ISSUER,
      },
    );
  }

  public issueRefreshToken(identifier: string): string {
    return this.jwtService.sign(
      { id: identifier },
      {
        secret: process.env.JWT_ADMIN_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_ADMIN_REFRESH_TOKEN_EXPIRATION_TIME,
        issuer: process.env.JWT_ISSUER,
      },
    );
  }
}
