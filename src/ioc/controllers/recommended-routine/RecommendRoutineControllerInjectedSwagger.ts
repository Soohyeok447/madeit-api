import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecommendedRoutineController } from '../../../adapter/recommended-routine/RecommendedRoutineController';
import {
  GetRecommendedRoutineResponse,
  GetRecommendedRoutinesByCategoryResponse,
} from '../../../domain/use-cases/recommended-routine/response.index';
import { ValidateMongoObjectId } from '../../../adapter/common/validators/ValidateMongoObjectId';
import { SwaggerRoutineNotFoundException } from '../routine/swagger/SwaggerRoutineNotFoundException';
import { GetRecommendedRoutineResponseDto } from '../../../domain/use-cases/recommended-routine/get-recommended-routine/dtos/GetRecommendedRoutineResponseDto';
import { GetRecommendedRoutinesByCategoryResponseDto } from '../../../domain/use-cases/recommended-routine/get-recommended-routines-by-category/dtos/GetRecommendedRoutinesByCategoryResponseDto';

@ApiTags('추천 루틴 관련 API')
@Controller('v1/recommended-routines')
export class RecommendedRoutineControllerInjectedDecorator extends RecommendedRoutineController {
  @ApiOperation({
    summary: '한 추천 루틴의 상세정보를 불러옵니다',
    description: `
    [Request headers]
    api access token

    [Request path parameter]
    /:routineId

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

    [Response]
    200, 404

    [에러코드]
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    루틴 불러오기 성공`,
    type: GetRecommendedRoutineResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @Get('/:id')
  public async getRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): GetRecommendedRoutineResponse {
    return super.getRecommendedRoutine(routineId);
  }

  @ApiOperation({
    summary: '추천 루틴 리스트를 불러옵니다',
    description: `
    [Request headers]
    api access token

    [Request query parameter]
    OPTIONAL String next - 페이징 토큰
    REQUIRED Int size - 불러올 리스트 사이즈
    REQUIRED Category category - 분류를 위한 카테고리

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

    [Response]
    200, 404

    [에러코드]
    1 - 유효하지 않은 category입니다 (400)
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    추천 루틴 리스트 불러오기 성공`,
    type: GetRecommendedRoutinesByCategoryResponseDto,
  })
  @Get()
  public async getRecommendedRoutinesByCategory(
    @Query() query: any,
  ): GetRecommendedRoutinesByCategoryResponse {
    return super.getRecommendedRoutinesByCategory(query);
  }
}
