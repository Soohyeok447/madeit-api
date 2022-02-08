import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { AddRoutineRequestDto } from '../../../adapter/routine/add-routine/AddRoutineRequestDto';
import { ModifyRoutineRequestDto } from '../../../adapter/routine/modify-routine/ModifyRoutineRequestDto';
import { Category } from '../../../domain/enums/Category';
import { MulterFile } from '../../../domain/types';
import { AddRoutineResponseDto } from '../../../domain/use-cases/routine/add-routine/dtos/AddRoutineResponseDto';
import { GetAllRoutinesByCategoryResponseDto } from '../../../domain/use-cases/routine/get-all-routines-by-category/dtos/GetAllRoutinesByCategoryResponseDto';
import { GetAllRoutinesResponseDto } from '../../../domain/use-cases/routine/get-all-routines/dtos/GetAllRoutinesResponseDto';
import { GetRoutineDetailResponseDto } from '../../../domain/use-cases/routine/get-routine-detail/dtos/GetRoutineDetailResponseDto';
import { ModifyRoutineResponseDto } from '../../../domain/use-cases/routine/modify-routine/dtos/ModifyRoutineResponseDto';
import {
  AddRoutineResponse,
  GetAllRoutinesByCategoryResponse,
  GetAllRoutinesResponse,
  GetRoutineDetailResponse,
  ModifyRoutineResponse,
  PatchCardnewsResponse,
  PatchThumbnailResponse,
} from '../../../domain/use-cases/routine/response.index';
import { RoutineController } from '../../../adapter/routine/RoutineController';
import { SwaggerUserNotAdminException } from './swagger/SwaggerUserNotAdminException';
import { SwaggerRoutineNameConflictException } from './swagger/SwaggerRoutineNameConflictException';
import { SwaggerRoutineNotFoundException } from './swagger/SwaggerRoutineNotFoundException';
import { CardnewsInterceptor, ThumbnailInterceptor } from 'src/adapter/common/interceptors/image.interceptor';
import { PatchCardnewsResponseDto } from 'src/domain/use-cases/routine/patch-cardnews/dtos/PatchCardnewsResponseDto';
import { PatchCardnewsRequestDto } from 'src/adapter/routine/patch-cardnews/PatchCardnewsRequestDto';
import { PatchThumbnailRequestDto } from 'src/adapter/routine/patch-thumbnail/PatchThumbnailRequestDto';
import { PatchThumbnailResponseDto } from 'src/domain/use-cases/routine/patch-thumbnail/dtos/PatchThumbnailResponseDto';
import { ValidateCustomDecorators, ValidateMongoObjectId } from 'src/adapter/common/validators/ValidateMongoObjectId';

@ApiTags('루틴 관련 API')
@Controller('v1/routines')
export class RoutineControllerInjectedDecorator extends RoutineController {
  @ApiOperation({
    summary: '루틴 등록 API',
    description: `
    루틴을 등록합니다.
    유저의 어드민권한 필요.`,
  })
  @ApiBody({
    description: `
    루틴 등록을 위한 form data`,
    type: AddRoutineRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: `
    루틴 생성 성공`,
    type: AddRoutineResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민 권한이 없음`,
    type: SwaggerUserNotAdminException,
  })
  @ApiResponse({
    status: 409,
    description: `
    루틴 이름 중복`,
    type: SwaggerRoutineNameConflictException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  async addRoutine(
    @User() user,
    @UploadedFiles() images: MulterFile[],
    @Body() addRoutineRequest: AddRoutineRequestDto,
  ): AddRoutineResponse {
    return super.addRoutine(user, images, addRoutineRequest);
  }

  @ApiOperation({
    summary: '루틴 수정 API',
    description: `
    루틴을 수정합니다.
    유저의 어드민권한 필요`,
  })
  @ApiBody({
    description: `
    루틴 수정을 위한 form data`,
    type: ModifyRoutineRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    루틴 수정 성공`,
    type: ModifyRoutineResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민 권한이 없음`,
    type: SwaggerUserNotAdminException,
  })
  @ApiResponse({
    status: 409,
    description: `
    루틴 이름 중복`,
    type: SwaggerRoutineNameConflictException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async modifyRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
    @Body() modifyRoutineRequest: ModifyRoutineRequestDto,
  ): ModifyRoutineResponse {
    return super.modifyRoutine(routineId, user, modifyRoutineRequest);
  }








  @ApiOperation({
    summary: '루틴의 썸네일 수정 API',
    description: `
    루틴의 썸네일을 수정합니다.
    유저의 어드민권한 필요`,
  })
  @ApiBody({
    description: `
    썸네일 수정을 위한 form data`,
    type: PatchThumbnailRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    썸네일 수정 성공`,
    type: PatchThumbnailResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민 권한이 없음`,
    type: SwaggerUserNotAdminException,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('accessToken | refreshToken')
  @UseInterceptors(ThumbnailInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/thumbnail')
  async patchThumbnail(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
    @UploadedFile() thumbnail: MulterFile,
  ): PatchThumbnailResponse {
    return super.patchThumbnail(routineId, user, thumbnail);
  }


  
  @ApiOperation({
    summary: '루틴의 카드뉴스 수정 API',
    description: `
    카드뉴스를 수정합니다.
    유저의 어드민권한 필요`,
  })
  @ApiBody({
    description: `
    카드뉴스 수정을 위한 form data`,
    type: PatchCardnewsRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    카드뉴스 수정 성공`,
    type: PatchCardnewsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민 권한이 없음`,
    type: SwaggerUserNotAdminException,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('accessToken | refreshToken')
  @UseInterceptors(CardnewsInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/cardnews')
  async patchCardnews(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
    @UploadedFiles() cardnews: MulterFile[],
  ): PatchCardnewsResponse {
    return super.patchCardnews(routineId, user, cardnews);
  }























  @ApiOperation({
    summary: '카테고리를 기준으로 루틴 목록의 정보를 얻는 API',
    description: `
    카테고리별로 루틴 목록을 가져옵니다`,
  })
  @ApiQuery({
    name: 'category',
    description: `
    find key`,
    type: String,
    enum: Category,
    required: true,
  })
  @ApiQuery({
    name: 'next',
    description: `
    페이징을 위한 nextCursor`,
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'size',
    description: `
    페이징을 위한 size`,
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: `
    카테고리를 키값으로 루틴 목록 불러오기 성공.

    만약 페이징으로 인해 더 불러올 데이터가 없으면
    {  
      "hasMore": false, 
      "nextCursor": null,
      "data": [...]
    }
    을 반환합니다.


    api 호출 이후 반환된 
    마지막 커서가 칼럼의 마지막 인덱스인 경우에도
    더 불러올 데이터가 없기 때문에 다음 호출에
    {
      "hasMore": false,
      "nextCursor": null,
      "data": []
    }
    을 반환합니다.

    hasMore의 속성이 false일 경우 더 이상 호출하지 않아도 됩니다`,
    type: GetAllRoutinesByCategoryResponseDto,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllRoutinesByCategory(
    @Query() query,
  ): GetAllRoutinesByCategoryResponse {
    return super.getAllRoutinesByCategory(query);
  }

  @ApiOperation({
    summary: '한 루틴의 상세정보를 얻는 API',
    description: `
    id로 루틴 상세정보를 가져옵니다.`,
  })
  @ApiResponse({
    status: 201,
    description: `
    루틴 불러오기 성공`,
    type: GetRoutineDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getRoutineDetail(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): GetRoutineDetailResponse {
    return super.getRoutineDetail(routineId);
  }
}
