import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * AuthGarud 미들웨어를 통과 후
 * JSON객체가 response에 req.user로서 추가가되는데
 * 그 객체를 user 프로퍼티 그 자체로 이용할 수 있게 transfer하는 데코레이터
 *
 * [Property]
 *
 * id
 */

export interface UserAuth {
  id: string;
}

export const UserAuth: any = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const req: any = ctx.switchToHttp().getRequest();

    const user: any = req.user;

    return {
      id: user.id,
    };
  },
);
