import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserAuth,
  UserPayload,
} from 'src/adapter/common/decorators/user.decorator';
import { AdminController } from '../../../adapter/admin/AdminController';
import { IssueAdminTokenRequestDto } from '../../../adapter/admin/issue-admin-token/IssueAdminTokenRequestDto';
import { ModifyPasswordRequestDto } from '../../../adapter/admin/modify-password/ModifyPasswordRequestDto';
import { RegisterAdminRequestDto } from '../../../adapter/admin/register-admin/RegisterAdminRequestDto';
import { AdminAuthGuard } from '../../../adapter/common/guards/AdminAuthGuard.guard';
import { AdminRefreshAuthGuard } from '../../../adapter/common/guards/AdminRefreshAuthGuard.guard';
import { IssueAdminTokenResponseDto } from '../../../domain/use-cases/admin/issue-admin-token/dtos/IssueAdminTokenResponseDto';
import { ModifyPasswordResponseDto } from '../../../domain/use-cases/admin/modify-password/dtos/ModifyPasswordResponseDto';
import { RefreshAdminTokenResponseDto } from '../../../domain/use-cases/admin/refresh-admin-token/dtos/RefreshAdminTokenResponseDto';
import { RegisterAdminResponseDto } from '../../../domain/use-cases/admin/register-admin/dtos/RegisterAdminResponseDto';

@ApiTags('어드민 API')
@Controller('v1/admin')
export class AdminControllerInjectedDecorator extends AdminController {
  @ApiOperation({
    summary: '[어드민] 어드민 가입 API',
    description: `

    [Request body]
    - REQUIRED - 
    String id
    String password


    - OPTIONAL -
   
    [Response]
    201

    [에러코드]
    `,
  })
  @ApiResponse({
    status: 201,
    description: `
    어드민 가입 성공`,
    type: RegisterAdminResponseDto,
  })
  @Post('/register')
  public registerAdmin(
    @Body() { id, password }: RegisterAdminRequestDto,
  ): Promise<RegisterAdminResponseDto> {
    return super.registerAdmin({
      id,
      password,
    });
  }

  @ApiOperation({
    summary: '[어드민] 비밀번호 수정 API',
    description: `
    어드민 토큰 필요


    [Request body]
    - REQUIRED - 
    String oldPassword
    String newPassword

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
    비밀번호 수정 성공`,
    type: ModifyPasswordResponseDto,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(AdminAuthGuard)
  @Put('/pw')
  public modifyPassword(
    @UserAuth() user: UserPayload,
    @Body() { oldPassword, newPassword }: ModifyPasswordRequestDto,
  ): Promise<ModifyPasswordResponseDto> {
    return super.modifyPassword(user, { oldPassword, newPassword });
  }

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
    type: IssueAdminTokenResponseDto,
  })
  @Post('/issue')
  public issueAdminToken(
    @Body() { id, password }: IssueAdminTokenRequestDto,
  ): Promise<IssueAdminTokenResponseDto> {
    return super.issueAdminToken({ id, password });
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
    86 - 존재하지 않는 어드민

    `,
  })
  @ApiResponse({
    status: 201,
    description: `
    토큰 재발급 성공`,
    type: RefreshAdminTokenResponseDto,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(AdminRefreshAuthGuard)
  @Post('/refresh')
  public refreshAdminToken(
    @UserAuth() user: UserPayload,
  ): Promise<RefreshAdminTokenResponseDto> {
    return super.refreshAdminToken(user);
  }
}
