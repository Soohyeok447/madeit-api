import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserAuth,
  UserPayload,
} from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { AddRoutineToCartRequestDto } from '../../../adapter/cart/add-routine-to-cart/AddRoutineToCartRequestDto';
import { GetCartsResponseDto } from '../../../domain/use-cases/cart/get-carts/dtos/GetCartsResponseDto';
import {
  AddRoutineToCartResponse,
  DeleteRoutineFromCartResponse,
  GetCartsResponse,
} from '../../../domain/use-cases/cart/response.index';
import { CartController } from '../../../adapter/cart/CartController';
import { SwaggerCartNotFoundException } from './swagger/SwaggerCartNotFoundException';
import { SwaggerCartConflictException } from './swagger/SwaggerCartConflictException';
import { ValidateMongoObjectId } from '../../../adapter/common/validators/ValidateMongoObjectId';
import { AddRoutineToCartResponseDto } from '../../../domain/use-cases/cart/add-routine-to-cart/dtos/AddRoutineToCartResponseDto';

@ApiTags('장바구니 관련 API')
@Controller('v1/carts')
export class CartControllerInjectedDecorator extends CartController {
  @ApiOperation({
    summary: '장바구니에 추천 루틴 추가 API',
    description: `
    추천루틴이 return됩니다.

    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 
    String recommendedRoutineId (추천루틴)

    - OPTIONAL -


    [Response]
    201, 409

    [에러코드]
    1 - 이미 장바구니에 담은 루틴입니다
    72 - id로 추천 루틴을 찾을 수 없음
    `,
  })
  @ApiBody({
    description: `
    장바구니에 추천 루틴을 추가하기 위한 routineId`,
    type: AddRoutineToCartRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: `
    장바구니에 추천 루틴 추가 성공`,
    type: AddRoutineToCartResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: `
    이미 장바구니에 존재중인 추천 루틴 추가시도`,
    type: SwaggerCartConflictException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post()
  public async addRecommendedRoutineToCart(
    @UserAuth() user: UserPayload,
    @Body() addRoutinesToCartRequest: AddRoutineToCartRequestDto,
  ): AddRoutineToCartResponse {
    return super.addRecommendedRoutineToCart(user, addRoutinesToCartRequest);
  }

  @ApiOperation({
    summary: '장바구니 리스트를 얻는 API',
    description: `
    추천루틴리스트가 return됩니다.

    [Request headers]
    api access token

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
    장바구니 리스트 불러오기 성공
    장바구니가 비어있으면 빈 배열을 반환합니다.`,
    type: GetCartsResponseDto,
    isArray: true,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getCarts(@UserAuth() user: UserPayload): GetCartsResponse {
    return super.getCarts(user);
  }

  @ApiOperation({
    summary: '장바구니 삭제 API',
    description: `
    recommendedRoutineId로 장바구니 삭제합니다

    [Request headers]
    api access token

    [Request path parameter]
    String recommendedRoutineId

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

        
    [Response]
    200, 404

    [에러코드]
    74 - 추천 루틴이 장바구니에 존재하지 않음
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    장바구니에 추천 루틴 제거 성공`,
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: `
    추천 루틴이 장바구니에 존재하지 않음`,
    type: SwaggerCartNotFoundException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(200)
  public async deleteRecommendedRoutineFromCart(
    @Param('id', ValidateMongoObjectId) recommendedRoutineId: string,
  ): DeleteRoutineFromCartResponse {
    return super.deleteRecommendedRoutineFromCart(recommendedRoutineId);
  }
}
