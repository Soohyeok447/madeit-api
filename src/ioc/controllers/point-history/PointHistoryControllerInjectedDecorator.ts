import { Controller, Get, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { PointHistoryController } from '../../../adapter/point-history/PointHistoryController';
import { GetPointHistoriesByUserIdResponseDto } from '../../../domain/use-cases/point-history/get-point-histories-by-userid/dtos/GetPointHistoriesByUserIdResponseDto';
import { GetPointHistoriesResponseDto } from '../../../domain/use-cases/point-history/get-point-histories/dtos/GetPointHistoriesResponseDto';

@ApiTags('포인트 히스토리 API')
@Controller('v1/point-histories')
export class PointHistoryControllerInjectedDecorator extends PointHistoryController {
  @ApiOperation({
    summary: '[어드민] 모든 유저의 포인트 히스토리 불러오는 API',
    description: `
    어드민 권한이 필요합니다.

    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    200, 401

    [에러코드]
    73 - 어드민이 아님
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    모든 유저의 포인트 히스토리 불러오기 성공`,
    type: [GetPointHistoriesResponseDto],
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('')
  public getPointHistories(
    @UserAuth() user: UserPayload,
  ): Promise<GetPointHistoriesResponseDto[]> {
    return super.getPointHistories(user);
  }

  @ApiOperation({
    summary: '본인의 포인트 히스토리 불러오는 API',
    description: `
    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    200

    [에러코드]
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    본인의 포인트 히스토리 불러오기 성공`,
    type: [GetPointHistoriesByUserIdResponseDto],
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  public getPointHistoriesByUserId(
    @UserAuth() user: UserPayload,
  ): Promise<GetPointHistoriesByUserIdResponseDto[]> {
    return super.getPointHistoriesByUserId(user);
  }
}
