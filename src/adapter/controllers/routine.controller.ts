import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { string } from 'joi';
import { RoutineService } from 'src/domain/routine/service/interface/routine.service';
import { AddRoutineInput } from 'src/domain/routine/use-cases/add-routine/dtos/add_routine.input';
import { AddRoutineOutput } from 'src/domain/routine/use-cases/add-routine/dtos/add_routine.output';
import { GetAllRoutinesInput } from 'src/domain/routine/use-cases/get-all-routines/dtos/get_all_routines.input';
import { GetAllRoutinesOutput } from 'src/domain/routine/use-cases/get-all-routines/dtos/get_all_routines.output';
import { GetRoutineDetailInput } from 'src/domain/routine/use-cases/get-routine-detail/dtos/get_routine_detail.input';
import { GetRoutineDetailOutput } from 'src/domain/routine/use-cases/get-routine-detail/dtos/get_routine_detail.output';

import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/swagger.dto';
import { AddRoutineRequest } from '../dto/routine/add_routine.request';

@Controller('v1')
@ApiTags('루틴 관련 API')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Post('routine')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '루틴 등록 API',
    description: '루틴을 등록합니다.<br />유저의 어드민권한 필요.',
  })
  @ApiBody({
    description: '루틴 등록을 위한 request dto',
    type: AddRoutineRequest,
  })
  @ApiResponse({
    status: 200,
    description: '루틴 생성 성공',
    type: AddRoutineOutput,
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
  async addRoutine(
    @User() user,
    @Body() addRoutineRequest: AddRoutineRequest,
  ): Promise<AddRoutineOutput> {
    const input: AddRoutineInput = {
      userId: user.id,
      routine: { ...addRoutineRequest },
    };

    const { newRoutineId } = await this.routineService.addRoutine(input);

    const response = {
      newRoutineId,
    };

    return response;
  }

  @Get('routines')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '모든 루틴의 정보를 얻는 API',
    description: '모든 루틴을 가져옵니다.',
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
    required: false,
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
    을 반환합니다.`,
    type: GetAllRoutinesOutput,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async getAllRoutines(
    @Query() query,
  ): Promise<GetAllRoutinesOutput> {
    let input: GetAllRoutinesInput;

    input = {
      next: query['next'],
      size: query['size'],
    };
    
    const { paging, data } = await this.routineService.getAllRoutines(input);
    
    const response = {
        paging,
        data,
      };
      
    return response;
  }

  @Get('routine/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '한 루틴의 상세정보를 얻는 API',
    description: 'id로 루틴 상세정보를 가져옵니다.',
  })
  @ApiResponse({
    status: 201,
    description: '루틴 불러오기 성공',
    type: GetRoutineDetailOutput,
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
  ): Promise<GetRoutineDetailOutput> {
    const input: GetRoutineDetailInput = {
      routineId,
    };

    const { ...routine } = await this.routineService.getRoutineDetail(input);

    const response = {
      ...routine,
    };

    return response;
  }
}
