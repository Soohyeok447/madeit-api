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
import { CartService } from '../../domain/use-cases/cart/service/interface/CartService';
import { AddRoutineToCartUsecaseDto } from '../../domain/use-cases/cart/use-cases/add-routine-to-cart/dtos/AddRoutineToCartUsecaseDto';
import { DeleteRoutineFromCartUsecaseDto } from '../../domain/use-cases/cart/use-cases/delete-routine-from-cart/dtos/DeleteRoutineFromCartUsecaseDto';
import { GetCartsResponseDto } from '../../domain/use-cases/cart/use-cases/get-carts/dtos/GetCartsResponseDto';
import { GetCartsUsecaseDto } from '../../domain/use-cases/cart/use-cases/get-carts/dtos/GetCartsUsecaseDto';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/JwtAuthGuard.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/SwaggerExceptions';
import { AddRoutineToCartRequestDto } from '../dto/cart/AddRoutineToCartRequestDto';

@Controller('v1/')
@ApiTags('장바구니 관련 API')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('cart')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '장바구니에 루틴 추가 API',
    description: '장바구니에 루틴을 추가합니다.',
  })
  @ApiBody({
    description: '장바구니에 루틴을 추가하기 위한 routineId',
    type: AddRoutineToCartRequestDto,
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
    @Body() addRoutinesToCartRequest: AddRoutineToCartRequestDto,
  ): Promise<void> {
    const input: AddRoutineToCartUsecaseDto = {
      userId: user.id,
      routineId: addRoutinesToCartRequest.routineId,
    };

    await this.cartService.addRoutineToCart(input);
  }

  @Get('cart')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '장바구니 리스트를 얻는 API',
    description: `장바구니 리스트를 가져옵니다.`,
  })
  @ApiResponse({
    status: 200,
    description: '장바구니 리스트 불러오기 성공',
    type: GetCartsResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async getCarts(@User() user): Promise<GetCartsResponseDto[]> {
    const input: GetCartsUsecaseDto = {
      userId: user.id,
    };

    const result = await this.cartService.getCarts(input);

    return result;
  }

  @Delete('cart/items/:id')
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
  async deleteRoutineFromCart(@Param('id') cartId: string): Promise<void> {
    const input: DeleteRoutineFromCartUsecaseDto = {
      cartId,
    };

    await this.cartService.deleteRoutineFromCart(input);
  }
}
