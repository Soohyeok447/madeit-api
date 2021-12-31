import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
import { AddRoutineInput } from 'src/domain/dto/routine/add_routine.input';
import { GetAllRoutinesInput } from 'src/domain/dto/routine/get_all_routines.input';
import { GetRoutineDetailInput } from 'src/domain/dto/routine/get_routine_detail.input';
import { RoutineService } from 'src/domain/services/interfaces/routine.service';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/swagger.dto';
import { AddRoutineRequest } from '../dto/routine/add_routine.request';
import { AddRoutineResponse } from '../dto/routine/add_routine.response';
import { GetAllRoutinesRequest } from '../dto/routine/get_all_routines.request';
import { GetAllRoutinesResponse } from '../dto/routine/get_all_routines.response';
import { GetRoutineDetailResponse } from '../dto/routine/get_routine_detail.response';

@Controller('v1/routine')
@ApiTags('루틴관련 API')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) { }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '루틴 등록 API',
    description:
      '루틴을 등록합니다. 유저의 어드민권한 필요, 어드민관련 token필요. production 서버에서는 이 endpoint가 존재하지 않습니다.',
  })
  @ApiBody({
    description: '루틴 등록을 위한 request dto',
    type: AddRoutineRequest,
  })
  @ApiResponse({
    status: 200,
    description: '루틴 생성 성공',
    type: AddRoutineResponse,
  })
  @ApiResponse({
    status:401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiResponse({
    status:400,
    description: '유효하지 않은 어드민 토큰',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status:401,
    description: '어드민 권한이 없음',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status:409,
    description: '루틴 이름 중복',
    type: SwaggerServerException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async addRoutine(
    @User() user,
    @Body() addRoutineRequest: AddRoutineRequest,
  ): Promise<AddRoutineResponse> {
    const input: AddRoutineInput = {
      userId: user.id,
      secret: addRoutineRequest.secret,
      routine: { ...addRoutineRequest }
    };

    const { newRoutineId } = await this.routineService.addRoutine(input);

    const response = {
      newRoutineId
    }

    return response;
  }

  @Post('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '모든 루틴의 정보를 얻는 API',
    description:
      '모든 루틴을 가져옵니다.',
  })
  @ApiBody({
    description: '루틴을 가져오기 위한 nextCursor. 처음엔 없어도 됩니다.',
    type: GetAllRoutinesRequest,
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
    type: GetAllRoutinesResponse,
  })
  @ApiResponse({
    status:401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async getAllRoutines(
    @Body() getAllRoutinesRequest?: GetAllRoutinesRequest,
  ): Promise<GetAllRoutinesResponse> {
    let input: GetAllRoutinesInput;

    if(getAllRoutinesRequest){
       input = {
        nextCursor: getAllRoutinesRequest.nextCursor
      };
    }

    const { paging, data } = await this.routineService.getAllRoutines(input);

    const response = {
      paging,
      data
    }

    return response;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '한 루틴의 상세정보를 얻는 API',
    description:
      'id로 루틴 상세정보를 가져옵니다.',
  })
  @ApiQuery({
    description: '루틴을 가져오기 위한 id query',
    name:'id',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: '루틴 불러오기 성공',
    type: GetRoutineDetailResponse,
  })
  @ApiResponse({
    status:400,
    description: '유효하지 않은 루틴id',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status:401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async getRoutineDetail(
    @Query() query: string,
  ): Promise<GetRoutineDetailResponse> {    
    const input: GetRoutineDetailInput = {
      routineId: query['id']
    };

    const { ...routine } = await this.routineService.getRoutineDetail(input);

    const response = {
      ...routine
    }

    return response;
  }
}
