import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Category } from '../../domain/enums/Category';
import { Resolution } from '../../domain/enums/Resolution';
import { MulterFile } from '../../domain/types';
import { RoutineService } from '../../domain/use-cases/routine/service/interface/RoutineService';
import { AddRoutineResponseDto } from '../../domain/use-cases/routine/use-cases/add-routine/dtos/AddRoutineResponseDto';
import { AddRoutineUsecaseDto } from '../../domain/use-cases/routine/use-cases/add-routine/dtos/AddRoutineUsecaseDto';
import { GetAllRoutinesByCategoryResponseDto } from '../../domain/use-cases/routine/use-cases/get-all-routines-by-category/dtos/GetAllRoutinesByCategoryResponseDto';
import { GetAllRoutinesByCategoryUsecaseDto } from '../../domain/use-cases/routine/use-cases/get-all-routines-by-category/dtos/GetAllRoutinesByCategoryUsecaseDto';
import { GetAllRoutinesResponseDto } from '../../domain/use-cases/routine/use-cases/get-all-routines/dtos/GetAllRoutinesResponseDto';
import { GetAllRoutinesUsecaseDto } from '../../domain/use-cases/routine/use-cases/get-all-routines/dtos/GetAllRoutinesUsecaseDto';
import { GetRoutineDetailResponseDto } from '../../domain/use-cases/routine/use-cases/get-routine-detail/dtos/GetRoutineDetailResponseDto';
import { GetRoutineDetailUsecaseDto } from '../../domain/use-cases/routine/use-cases/get-routine-detail/dtos/GetRoutineDetailUsecaseDto';
import { ModifyRoutineResponseDto } from '../../domain/use-cases/routine/use-cases/modify-routine/dtos/ModifyRoutineResponseDto';
import { ModifyRoutineUsecaseDto } from '../../domain/use-cases/routine/use-cases/modify-routine/dtos/ModifyRoutineUsecaseDto';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/JwtAuthGuard.guard';
import { RoutineImagesInterceptor } from '../common/interceptors/image.interceptor';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/SwaggerExceptions';
import { AddRoutineRequestDto } from '../dto/routine/AddRoutineRequestDto';
import { ModifyRoutineRequestDto } from '../dto/routine/ModifyRoutineRequestDto';

@Controller('v1')
@ApiTags('루틴 관련 API')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Post('routines')
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
  async addRoutine(
    @User() user,
    @UploadedFiles() images: MulterFile[],
    @Body() addRoutineRequest: AddRoutineRequestDto,
  ): Promise<AddRoutineResponseDto> {
    const input: AddRoutineUsecaseDto = {
      userId: user.id,
      thumbnail: images['thumbnail'][0],
      cardnews: images['cardnews'],
      price: +addRoutineRequest.price,
      ...addRoutineRequest,
    };

    const { routine } = await this.routineService.addRoutine(input);

    const response = {
      routine,
    };

    return response;
  }

  @Put('routines')
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
  async modifyRoutine(
    @User() user,
    @Body() modifyRoutineRequest: ModifyRoutineRequestDto,
    @UploadedFiles() images?: MulterFile[],
  ): Promise<ModifyRoutineResponseDto> {
    let thumbnail = null;
    const cardnews = images['cardnews'] ?? null;

    if (images['thumbnail']) {
      thumbnail = images['thumbnail'][0];
    }

    const input: ModifyRoutineUsecaseDto = {
      userId: user.id,
      thumbnail,
      cardnews,
      price: +modifyRoutineRequest.price,
      ...modifyRoutineRequest,
    };

    const { routine } = await this.routineService.modifyRoutine(input);

    const response = {
      routine,
    };

    return response;
  }

  @Get('routines')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '모든 루틴의 정보를 얻는 API',
    description: `모든 루틴을 가져옵니다.<br/><br/>
    Image는 16진법으로 변환 한 buffer입니다.
    16진법에서 buffer로 conversion 필요`,
  })
  @ApiQuery({
    description: '페이징을 위한 nextCursor',
    type: String,
    name: 'next',
    required: false,
  })
  @ApiQuery({
    description: '페이징을 위한 size',
    type: Number,
    name: 'size',
    required: true,
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
    description: `루틴 불러오기 성공.  <br/>
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
    type: GetAllRoutinesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async getAllRoutines(@Query() query): Promise<GetAllRoutinesResponseDto> {
    const input: GetAllRoutinesUsecaseDto = {
      next: query['next'],
      size: +query['size'],
      resolution: query['resolution'],
    };

    console.log(input.resolution);

    const { paging, data } = await this.routineService.getAllRoutines(input);

    const response = {
      paging,
      data,
    };

    return response;
  }

  @Get('routines/:category')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '카테고리를 기준으로 루틴 목록의 정보를 얻는 API',
    description: `카테고리별로 루틴 목록을 가져옵니다.<br/><br/>
    Image는 16진법으로 변환 한 buffer입니다.
    16진법에서 buffer로 conversion 필요
    `,
  })
  @ApiParam({
    name: 'category',
    description: 'find key',
    type: String,
    enum: Category,
    required: true,
  })
  @ApiQuery({
    description: '페이징을 위한 nextCursor',
    type: String,
    name: 'next',
    required: false,
  })
  @ApiQuery({
    description: '페이징을 위한 size',
    type: Number,
    name: 'size',
    required: true,
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
  async getAllRoutinesByCategory(
    @Param('category') category,
    @Query() query,
  ): Promise<GetAllRoutinesByCategoryResponseDto> {
    const input: GetAllRoutinesByCategoryUsecaseDto = {
      category,
      next: query['next'],
      size: +query['size'],
      resolution: query['resolution'],
    };

    const { paging, data } = await this.routineService.getAllRoutinesByCategory(
      input,
    );

    const response = {
      paging,
      data,
    };

    return response;
  }

  @Get('routines/:id')
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
  async getRoutineDetail(
    @Param('id') routineId: string,
    @Query('resolution') resolution: Resolution,
  ): Promise<GetRoutineDetailResponseDto> {
    const input: GetRoutineDetailUsecaseDto = {
      routineId,
      resolution,
    };

    const { ...routine } = await this.routineService.getRoutineDetail(input);

    const response = {
      ...routine,
    };

    return response;
  }
}