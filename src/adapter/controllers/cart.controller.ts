import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddRoutineToCartInput } from 'src/domain/dto/cart/add_routines_to_cart.input';
import { DeleteRoutineFromCartInput } from 'src/domain/dto/cart/delete_routines_from_cart.input';
import { GetCartInput } from 'src/domain/dto/cart/get_cart.input';
import { CartService } from 'src/domain/services/interfaces/cart.service';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/swagger.dto';
import { AddRoutineToCartRequest } from '../dto/cart/add_routines_to_cart.request';
import { DeleteRoutineFromCartRequest } from '../dto/cart/delete_routine_from_cart.request';
import { GetCartResponse } from '../dto/cart/get_cart.response';

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
    status: 400,
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
    description: `장바구니 리스트를 가져옵니다. <br/> 
      22.01.01 기준 모든 routine model을 return하는데 <br/> 
      클라이언트에서 보여야할 속성들이 정해지면 바로 mapping 가능`,
  })
  @ApiResponse({
    status: 200,
    description: '장바구니 리스트 불러오기 성공',
    type: GetCartResponse,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async getCart(@User() user): Promise<GetCartResponse> {
    const input: GetCartInput = {
      userId: user.id,
    };

    const { shoppingCart } = await this.cartService.getCart(input);

    const response = {
      shoppingCart,
    };

    return response;
  }

  @Delete('me/cart/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '장바구니에 있는 루틴 제거 API',
    description: '장바구니에 있는 루틴을 routineId로 제거합니다',
  })
  @ApiResponse({
    status: 201,
    description: '장바구니에 루틴 제거 성공',
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 루틴id<br/>장바구니에 해당 루틴이 없음',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async deleteRoutineFromCart(
    @Param('id') routineId: string,
    @User() user,
  ): Promise<void> {
    const input: DeleteRoutineFromCartInput = {
      userId: user.id,
      routineId,
    };

    await this.cartService.deleteRoutineFromCart(input);
  }
}
