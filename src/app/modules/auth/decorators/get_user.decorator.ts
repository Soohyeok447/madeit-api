import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Jwt validation 이후 얻는 user 객체를 transfer 합니다.
 * 
 * id
 * 
 * email
 */
export const GetUser = createParamDecorator((_, ctx: ExecutionContext)  =>{
    const req = ctx.switchToHttp().getRequest();

    const user = req.user;

    //나중에 주로 쓰는 find 메서드만 쓰도록 리팩토링
    return {
        id: user.id, 
        email: user.email
    };
})