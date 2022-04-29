import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { throwUnauthorizedException } from '../exceptions/throwUnauthorizedExceptions';

@Injectable()
export class ExchangeAuthGuard extends AuthGuard('jwt_exchange') {
  public canActivate(
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
