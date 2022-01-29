import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { RoutineImagesInterceptor } from '../../../adapter/common/interceptors/image.interceptor';
import { AddRoutineRequestDto } from '../../../adapter/dto/routine/AddRoutineRequestDto';
import { ModifyRoutineRequestDto } from '../../../adapter/dto/routine/ModifyRoutineRequestDto';
import { Category } from '../../../domain/enums/Category';
import { Resolution } from '../../../domain/enums/Resolution';
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
} from '../../../domain/use-cases/routine/response.index';
import { RoutineController } from '../../../adapter/controllers/RoutineController';
import {
  SwaggerJwtException,
  SwaggerServerException,
} from '../SwaggerExceptions';

@ApiTags('루틴 관련 API')
@Controller('v1/routines')
export class RoutineControllerInjectedDecorator extends RoutineController {
  @ApiOperation({
    summary: '루틴 등록 API',
    description: `루틴을 등록합니다.<br />
    유저의 어드민권한 필요.<br/>
    thumbnail image, cardnews는 required`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      '루틴 등록을 위한 form data <br/> try it out을 누르면 자세히 나옴',
    type: AddRoutineRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: '루틴 생성 성공',
    type: AddRoutineResponseDto,
  })
  @ApiResponse({
    status: 401,
    description:
      '유효하지 않은 JWT가 헤더에 포함돼있음 <br/> 어드민 권한이 없음',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 어드민 토큰',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 409,
    description: '루틴 이름 중복',
    type: SwaggerServerException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseInterceptors(RoutineImagesInterceptor)
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
    description: `루틴을 수정합니다.<br />
    유저의 어드민권한 필요.<br/>
    thumbnail image, cardnews는 optional`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      '루틴 수정을 위한 form data <br/> try it out을 누르면 편하게 볼 수 있음;;',
    type: ModifyRoutineRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: '루틴 수정 성공',
    type: ModifyRoutineResponseDto,
  })
  @ApiResponse({
    status: 401,
    description:
      '유효하지 않은 JWT가 헤더에 포함돼있음 <br/> 어드민 권한이 없음',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 어드민 토큰',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 409,
    description: '루틴 이름 중복',
    type: SwaggerServerException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseInterceptors(RoutineImagesInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async modifyRoutine(
    @User() user,
    @Param('id') routineId: string,
    @Body() modifyRoutineRequest: ModifyRoutineRequestDto,
    @UploadedFiles() images?: MulterFile[],
  ): ModifyRoutineResponse {
    return super.modifyRoutine(user, routineId, modifyRoutineRequest, images);
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({
  //   summary: '모든 루틴의 정보를 얻는 API',
  //   description: `모든 루틴을 가져옵니다.<br/><br/>
  //   Image는 16진법으로 변환 한 buffer입니다.
  //   16진법에서 buffer로 conversion 필요`,
  // })
  // @ApiQuery({
  //   description: '페이징을 위한 nextCursor',
  //   type: String,
  //   name: 'next',
  //   required: false,
  // })
  // @ApiQuery({
  //   description: '페이징을 위한 size',
  //   type: Number,
  //   name: 'size',
  //   required: true,
  // })
  // @ApiQuery({
  //   description: '해상도',
  //   type: Number,
  //   name: 'resolution',
  //   enum: Resolution,
  //   required: true,
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: `루틴 불러오기 성공.  <br/>
  //   더 불러올 것이 없다면 hasMore이 false로 반환됩니다.   <br/>
  //   만약 마지막 커서가 마지막 인덱스인 경우 다음 요청은  <br/>
  //   {  <br/>
  //     data = null, <br/>
  //     "paging" : {  <br/>
  //     hasMore = false,  <br/>
  //   nextCursor = null,  <br/>
  //     } <br/>
  // } <br/>
  //   을 반환합니다.<br/><br/>
  //   Image는 16진법으로 변환 한 buffer입니다.
  //   16진법에서 buffer로 conversion 필요`,
  //   type: GetAllRoutinesResponseDto,
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: '유효하지 않은 JWT가 헤더에 포함돼있음',
  //   type: SwaggerJwtException,
  // })
  // @ApiBearerAuth('accessToken | refreshToken')
  // async getAllRoutines(@Query() query): GetAllRoutinesResponse {
  //   return super.getAllRoutines(query);
  // }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '카테고리를 기준으로 루틴 목록의 정보를 얻는 API',
    description: `카테고리별로 루틴 목록을 가져옵니다.<br/><br/>
    Image는 16진법으로 변환 한 buffer입니다.
    16진법에서 buffer로 conversion 필요
    `,
  })
  @ApiQuery({
    name: 'category',
    description: 'find key',
    type: String,
    enum: Category,
    required: true,
  })
  @ApiQuery({
    name: 'next',
    description: '페이징을 위한 nextCursor',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'size',
    description: '페이징을 위한 size',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'resolution',
    description: '해상도',
    type: Number,
    enum: Resolution,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: `루틴 목록 불러오기 성공.  <br/>
    더 불러올 것이 없다면 hasMore이 false로 반환됩니다.   <br/>
    만약 마지막 커서가 마지막 인덱스인 경우 다음 요청은  <br/> 
    {  <br/>
      data = null, <br/>
      "paging" : {  <br/>
      hasMore = false,  <br/>
    nextCursor = null,  <br/>
      } <br/>
  } <br/>
    을 반환합니다.<br/><br/>
    Image는 16진법으로 변환 한 buffer입니다.
    16진법에서 buffer로 conversion 필요`,
    type: GetAllRoutinesByCategoryResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @Get()
  async getAllRoutinesByCategory(
    @Query() query,
  ): GetAllRoutinesByCategoryResponse {
    return super.getAllRoutinesByCategory(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '한 루틴의 상세정보를 얻는 API',
    description: `id로 루틴 상세정보를 가져옵니다.<br/><br/>
    Image는 16진법으로 변환 한 buffer입니다.
    16진법에서 buffer로 conversion 필요`,
  })
  @ApiQuery({
    description: '해상도',
    type: Number,
    name: 'resolution',
    enum: Resolution,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: `루틴 불러오기 성공<br/><br/>
    Image는 16진법으로 변환 한 buffer입니다.
    16진법에서 buffer로 conversion 필요`,
    type: GetRoutineDetailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 루틴id',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @Get('/:id')
  async getRoutineDetail(
    @Param('id') routineId: string,
    @Query('resolution') resolution: Resolution,
  ): GetRoutineDetailResponse {
    return super.getRoutineDetail(routineId, resolution);
  }
}
