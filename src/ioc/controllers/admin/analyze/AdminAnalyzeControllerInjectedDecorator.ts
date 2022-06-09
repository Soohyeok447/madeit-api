import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdminAnalyzeController } from '../../../../adapter/admin/analyze/AdminAnalyzeController';
import { AnalyzeRoutinesUsageResponseDto } from '../../../../domain/use-cases/admin/analyze-routines-usage/dtos/AnalyzeRoutinesUsageResponseDto';
import { CountUsersResponseDto } from '../../../../domain/use-cases/admin/count-users/dtos/CountUsersResponseDto';

@ApiTags('어드민 분석 API')
@Controller('v1/admin/analyze')
export class AdminAnalyzeControllerInjectedDecorator extends AdminAnalyzeController {
  @ApiOperation({
    summary: '[어드민] 회원가입한 사용자 수를 불러옵니다',
    description: `
    admin token must be issued
    
    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    200, 404

    [에러코드]
    86 - 존재하지 않는 어드민
    87 - 유효하지 않은 어드민 토큰

    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    활성 사용자 수 불러오기 성공`,
    type: CountUsersResponseDto,
  })
  @Get('/count-users')
  public countUsers(@Req() req: Request): Promise<CountUsersResponseDto> {
    return super.countUsers(req);
  }

  @ApiOperation({
    summary: '[어드민] 최소 한개의 루틴을 생성한 사용자 수를 불러옵니다',
    description: `
    admin token must be issued

    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    200, 404

    [에러코드]
    86 - 존재하지 않는 어드민
    87 - 유효하지 않은 어드민 토큰

    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    최소 한개의 루틴을 생성한 사용자 수 불러오기 성공`,
    type: CountUsersResponseDto,
  })
  @Get('/count-users-added-one-routine')
  public countUsersAddedOneRoutine(
    @Req() req: Request,
  ): Promise<CountUsersResponseDto> {
    return super.countUsersAddedOneRoutine(req);
  }

  @ApiOperation({
    summary: '[어드민] 평균 루틴 생성, 삭제 수를 불러옵니다',
    description: `
    admin token must be issued

    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    200, 404

    [에러코드]
    86 - 존재하지 않는 어드민
    87 - 유효하지 않은 어드민 토큰

    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    평균 루틴 생성, 삭제 수를 불러오기 성공`,
    type: AnalyzeRoutinesUsageResponseDto,
  })
  @Get('/routines-usage')
  public analyzeRoutinesUsage(
    @Req() req: Request,
  ): Promise<AnalyzeRoutinesUsageResponseDto[]> {
    return super.analyzeRoutinesUsage(req);
  }
}
