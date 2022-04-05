import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { throwUnauthorizedException } from './throwUnauthorizedExceptions';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public publiccanActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  public handleRequest(err: any, user: any, info: any): any {
    if (err || !user) {
      throwUnauthorizedException(info, err);
    }

    return user;
  }
}
