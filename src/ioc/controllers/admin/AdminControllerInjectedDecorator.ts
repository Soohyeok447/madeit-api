import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
// import { RegisterAdminRequestDto } from '../../../adapter/admin/register-admin/RegisterAdminRequestDto';
// import { RegisterAdminResponseDto } from '../../../domain/use-cases/admin/register-admin/dtos/RegisterAdminResponseDto';
import { AdminController } from '../../../adapter/admin/AdminController';
import { IssueAdminTokenRequestDto } from '../../../adapter/admin/issue-admin-token/IssueAdminTokenRequestDto';
import { ImageInterceptor } from '../../../adapter/common/interceptors/image.interceptor';
import { AddImageByAdminResponseDto } from '../../../domain/use-cases/admin/add-image-by-admin/dtos/AddImageByAdminResponseDto';
import { SwaggerUserNotAdminException } from '../recommended-routine/swagger/SwaggerUserNotAdminException';

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

  @ApiOperation({
    summary: '[어드민] 어드민토큰이 포함된 httpOnly 쿠키를 발급합니다',
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
    summary: '[어드민] 토큰을 재발급합니다',
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

  @ApiOperation({
    summary: '[어드민] 이미지를 추가하고 id를 반환받습니다',
    description: `
    [multipart/form]
    image - file
    description? - string

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

    [Response]
    201, 401

    [에러코드]`,
  })
  @ApiResponse({
    status: 201,
    description: `
    이미지 등록 성공`,
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민 권한이 없음`,
    type: SwaggerUserNotAdminException,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(ImageInterceptor)
  @Post('/image')
  public async addImageByAdmin(
    @Req() req: Request,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<AddImageByAdminResponseDto> {
    return super.addImageByAdmin(req, image);
  }
}
