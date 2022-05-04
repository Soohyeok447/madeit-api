import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AdminController } from '../../../adapter/admin/AdminController';
import { IssueAdminTokenRequestDto } from '../../../adapter/admin/issue-admin-token/IssueAdminTokenRequestDto';
// import { AdminAuthGuard } from '../../../adapter/common/guards/AdminAuthGuard.guard';
// import { ModifyPasswordRequestDto } from '../../../adapter/admin/modify-password/ModifyPasswordRequestDto';
// import { ModifyPasswordResponseDto } from '../../../domain/use-cases/admin/modify-password/dtos/ModifyPasswordResponseDto';
// import { RegisterAdminRequestDto } from '../../../adapter/admin/register-admin/RegisterAdminRequestDto';
// import { RegisterAdminResponseDto } from '../../../domain/use-cases/admin/register-admin/dtos/RegisterAdminResponseDto';

@ApiTags('어드민 API')
@Controller('v1/admin')
export class AdminControllerInjectedDecorator extends AdminController {
  // @ApiOperation({
  //   summary: '[어드민] 어드민 가입 API',
  //   description: `

  //   [Request body]
  //   - REQUIRED -
  //   String id
  //   String password

  //   - OPTIONAL -

  //   [Response]
  //   201

  //   [에러코드]
  //   `,
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: `
  //   어드민 가입 성공`,
  //   type: RegisterAdminResponseDto,
  // })
  // @Post('/register')
  // public registerAdmin(
  //   @Body() { id, password }: RegisterAdminRequestDto,
  // ): Promise<RegisterAdminResponseDto> {
  //   return super.registerAdmin({
  //     id,
  //     password,
  //   });
  // }

  // @ApiOperation({
  //   summary: '[어드민] 비밀번호 수정 API',
  //   description: `
  //   어드민 토큰 필요

  //   [Request body]
  //   - REQUIRED -
  //   String oldPassword
  //   String newPassword

  //   - OPTIONAL -

  //   [Response]
  //   201, 401, 404

  //   [에러코드]
  //   86 - 존재하지 않는 어드민
  //   87 - 어드민 인증 실패
  //   `,
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: `
  //   비밀번호 수정 성공`,
  //   type: ModifyPasswordResponseDto,
  // })
  // @ApiBearerAuth('JWT')
  // @UseGuards(AdminAuthGuard)
  // @Put('/pw')
  // public modifyPassword(
  //   @UserAuth() user: UserPayload,
  //   @Body() { oldPassword, newPassword }: ModifyPasswordRequestDto,
  // ): Promise<ModifyPasswordResponseDto> {
  //   return super.modifyPassword(user, { oldPassword, newPassword });
  // }

  @ApiOperation({
    summary: '[어드민] 토큰 발급 API',
    description: `
    [Request body]
    - REQUIRED - 
    String id
    String password

    - OPTIONAL -
   
    [Response]
    201, 401, 404

    [에러코드]
    86 - 존재하지 않는 어드민
    87 - 어드민 인증 실패
    `,
  })
  @ApiResponse({
    status: 201,
    description: `
    토큰 발급 성공`,
    type: Object,
  })
  @Post('/issue')
  public issueAdminToken(
    @Body() { id, password }: IssueAdminTokenRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Record<string, never>> {
    return super.issueAdminToken({ id, password }, res);
  }

  @ApiOperation({
    summary: '[어드민] 토큰 재발급 API',
    description: `
    리프레시 토큰 필요


    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    201, 404

    [에러코드]
    1 - 유효하지 않은 어드민 재발급 토큰
    86 - 존재하지 않는 어드민

    `,
  })
  @ApiResponse({
    status: 201,
    description: `
    토큰 재발급 성공`,
    type: Object,
  })
  @Post('/refresh')
  public refreshAdminToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<Record<string, never>> {
    return super.refreshAdminToken(res, req);
  }
}
