import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/adapter/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/adapter/common/guards/JwtAuthGuard.guard";
import { AddRoutineToCartRequestDto } from "src/adapter/dto/cart/AddRoutineToCartRequestDto";
import { AddRoutineToCartUsecaseDto } from "src/domain/use-cases/cart/use-cases/add-routine-to-cart/dtos/AddRoutineToCartUsecaseDto";
import { DeleteRoutineFromCartUsecaseDto } from "src/domain/use-cases/cart/use-cases/delete-routine-from-cart/dtos/DeleteRoutineFromCartUsecaseDto";
import { GetCartsResponseDto } from "src/domain/use-cases/cart/use-cases/get-carts/dtos/GetCartsResponseDto";
import { GetCartsUsecaseDto } from "src/domain/use-cases/cart/use-cases/get-carts/dtos/GetCartsUsecaseDto";
import { CartController } from "../../../adapter/controllers/CartController";
import { SwaggerJwtException, SwaggerServerException } from "../SwaggerExceptions";


@ApiTags('장바구니 관련 API')
@Controller('v1/carts')
export class CartControllerInjectedDecorator extends CartController {
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
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCarts(@User() user): Promise<GetCartsResponseDto[]> {
    return super.getCarts(user);
  }
  
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
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteRoutineFromCart(@Param('id') cartId: string): Promise<void> {
    return super.deleteRoutineFromCart(cartId);
  }
}