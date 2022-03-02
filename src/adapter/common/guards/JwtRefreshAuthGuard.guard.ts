import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { throwUnauthorizedException } from './throwUnauthorizedExceptions';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt_refresh') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throwUnauthorizedException(info, err);
    }

    return user;
  }
}
