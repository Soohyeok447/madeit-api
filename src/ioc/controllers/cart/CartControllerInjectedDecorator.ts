import {
  Body,
  Controller,
  Delete,
  Get,
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
  // @ApiOperation({
  //   summary: '장바구니에 루틴 추가 API',
  //   description: `
  //   장바구니에 루틴을 추가합니다`,
  // })
  // @ApiBody({
  //   description: `
  //   장바구니에 루틴을 추가하기 위한 routineId`,
  //   type: AddRoutineToCartRequestDto,
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: `
  //   장바구니에 루틴 추가 성공`,
  // })
  // @ApiResponse({
  //   status: 409,
  //   description: `
  //   이미 장바구니에 존재중인 루틴 추가시도`,
  //   type: SwaggerCartConflictException,
  // })
  // @ApiBearerAuth('accessToken | refreshToken')
  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async addRoutinesToCart(
  //   @User() user,
  //   @Body() addRoutinesToCartRequest: AddRoutineToCartRequestDto,
  // ): Promise<void> {
  //   return super.addRoutinesToCart(user, addRoutinesToCartRequest);
  // }

  // @ApiOperation({
  //   summary: '장바구니 리스트를 얻는 API',
  //   description: `
  //   장바구니 리스트를 가져옵니다.`,
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: `
  //   장바구니 리스트 불러오기 성공
  //   장바구니가 비어있으면 빈 배열을 반환합니다.`,
  //   type: GetCartsResponseDto,
  //   isArray: true,
  // })
  // @ApiBearerAuth('accessToken | refreshToken')
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async getCarts(@User() user): GetCartsResponse {
  //   return super.getCarts(user);
  // }

  // @ApiOperation({
  //   summary: '장바구니 삭제 API',
  //   description: `
  //   cartId로 장바구니를 삭제합니다`,
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: `
  //   장바구니에 루틴 제거 성공`,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: `
  //   해당 장바구니 없음`,
  //   type: SwaggerCartNotFoundException,
  // })
  // @ApiBearerAuth('accessToken | refreshToken')
  // @UseGuards(JwtAuthGuard)
  // @Delete('/:id')
  // async deleteRoutineFromCart(
  //   @Param('id', ValidateMongoObjectId) cartId: string,
  // ): Promise<void> {
  //   return super.deleteRoutineFromCart(cartId);
  // }
}
