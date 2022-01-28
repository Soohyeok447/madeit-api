import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
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
} from '../../ioc/controllers/SwaggerExceptions';
import { AddRoutineToCartRequestDto } from '../dto/cart/AddRoutineToCartRequestDto';

@Injectable()
export class CartController {
  constructor(private readonly cartService: CartService) {}

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

  async getCarts(@User() user): Promise<GetCartsResponseDto[]> {
    const input: GetCartsUsecaseDto = {
      userId: user.id,
    };

    const result = await this.cartService.getCarts(input);

    return result;
  }

  async deleteRoutineFromCart(@Param('id') cartId: string): Promise<void> {
    const input: DeleteRoutineFromCartUsecaseDto = {
      cartId,
    };

    await this.cartService.deleteRoutineFromCart(input);
  }
}
