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
import { User } from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { AddRoutineToCartRequestDto } from '../../../adapter/cart/add-routine-to-cart/AddRoutineToCartRequestDto';
import { GetCartsResponseDto } from '../../../domain/use-cases/cart/get-carts/dtos/GetCartsResponseDto';
import { GetCartsResponse } from '../../../domain/use-cases/cart/response.index';
import { CartController } from '../../../adapter/cart/CartController';
import { SwaggerCartNotFoundException } from './swagger/SwaggerCartNotFoundException';
import { SwaggerCartConflictException } from './swagger/SwaggerCartConflictException';
import { ValidateMongoObjectId } from '../../../adapter/common/validators/ValidateMongoObjectId';

@ApiTags('장바구니 관련 API')
@Controller('v1/carts')
export class CartControllerInjectedDecorator extends CartController {
  @ApiOperation({
    summary: '장바구니에 추천 루틴 추가 API',
    description: `
    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 
    String routineId (추천루틴)

    - OPTIONAL -


    [Response]
    201, 409

    [에러코드]
    1 - 중복되는 추천 루틴 제목 존재
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
  })
  @ApiResponse({
    status: 409,
    description: `
    이미 장바구니에 존재중인 추천 루틴 추가시도`,
    type: SwaggerCartConflictException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  async addRoutinesToCart(
    @User() user,
    @Body() addRoutinesToCartRequest: AddRoutineToCartRequestDto,
  ): Promise<void> {
    return super.addRoutinesToCart(user, addRoutinesToCartRequest);
  }

  @ApiOperation({
    summary: '장바구니 리스트를 얻는 API',
    description: `
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
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCarts(@User() user): GetCartsResponse {
    return super.getCarts(user);
  }

  @ApiOperation({
    summary: '장바구니 삭제 API',
    description: `
    routineId아닙니다 cartsId입니다

    [Request headers]
    api access token

    [Request path parameter]
    String cartsId

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

        
    [Response]
    204, 404

    [에러코드]
    74 - 추천 루틴이 장바구니에 존재하지 않음
    `,
  })
  @ApiResponse({
    status: 204,
    description: `
    장바구니에 추천 루틴 제거 성공`,
  })
  @ApiResponse({
    status: 404,
    description: `
    추천 루틴이 장바구니에 존재하지 않음`,
    type: SwaggerCartNotFoundException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteRoutineFromCart(
    @Param('id', ValidateMongoObjectId) cartId: string,
  ): Promise<void> {
    return super.deleteRoutineFromCart(cartId);
  }
}
