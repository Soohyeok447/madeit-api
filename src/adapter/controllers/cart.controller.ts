import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddRoutineToCartInput } from 'src/domain/cart/use-cases/add-routine-to-cart/dtos/add_routines_to_cart.input';

import { CartService } from 'src/domain/cart/service/interface/cart.service';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/swagger.dto';
import { AddRoutineToCartRequest } from '../dto/cart/add_routines_to_cart.request';
import { GetCartsInput } from 'src/domain/cart/use-cases/get-carts/dtos/get_carts.input';
import { DeleteRoutineFromCartInput } from 'src/domain/cart/use-cases/delete-routine-from-cart/dtos/delete_routines_from_cart.input';
import { GetCartsOutput } from 'src/domain/cart/use-cases/get-carts/dtos/get_carts.output';

@Controller('v1/users')
@ApiTags('장바구니 관련 API')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('me/cart')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '장바구니에 루틴 추가 API',
    description: '장바구니에 루틴을 추가합니다.',
  })
  @ApiBody({
    description: '장바구니에 루틴을 추가하기 위한 routineId',
    type: AddRoutineToCartRequest,
  })
  @ApiResponse({
    status: 201,
    description: '장바구니에 루틴 추가 성공',
  })
  @ApiResponse({
    status: 409,
    description: '이미 장바구니에 존재중인 루틴 추가시도',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async addRoutinesToCart(
    @User() user,
    @Body() addRoutinesToCartRequest: AddRoutineToCartRequest,
  ): Promise<void> {

    const input: AddRoutineToCartInput = {
      userId: user.id,
      routineId: addRoutinesToCartRequest.routineId,
    };

    await this.cartService.addRoutineToCart(input);
  }

  @Get('me/carts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '장바구니 리스트를 얻는 API',
    description: `장바구니 리스트를 가져옵니다.`,
  })
  @ApiResponse({
    status: 200,
    description: '장바구니 리스트 불러오기 성공',
    type: GetCartsOutput,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async getCarts(@User() user): Promise<GetCartsOutput[]> {
    const input: GetCartsInput = {
      userId: user.id,
    };

    const result = await this.cartService.getCarts(input);

    return result;
  }

  @Delete('me/cart/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '장바구니 삭제 API',
    description: 'cartId로 장바구니를 삭제합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '장바구니에 루틴 제거 성공',
  })
  @ApiResponse({
    status: 404,
    description: '해당 장바구니 없음',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async deleteRoutineFromCart(
    @Param('id') cartId: string,
  ): Promise<void> {

    const input: DeleteRoutineFromCartInput = {
      cartId
    };

    await this.cartService.deleteRoutineFromCart(input);
  }
}
