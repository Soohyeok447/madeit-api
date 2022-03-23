import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CartRepository } from '../../domain/repositories/cart/CartRepository';
import { CreateCartDto } from '../../domain/repositories/cart/dtos/CreateCartDto';
import { CartSchemaModel } from '../schemas/models/CartSchemaModel';
import { Cart } from '../../domain/entities/Cart';
import { CartMapper } from './mappers/CartMapper';

@Injectable()
export class CartRepositoryImpl implements CartRepository {
  constructor(
    @InjectModel('Cart')
    private readonly cartModel: Model<CartSchemaModel>,
  ) {}

  public async create(dto: CreateCartDto): Promise<Cart> {
    const mappedDto = CartMapper.mapCreateDtoToSchema(dto);

    const newCart = new this.cartModel(mappedDto);

    const result = await newCart.save();

    return CartMapper.mapSchemaToEntity(result);
  }

  public async delete(cartId: string): Promise<void> {
    await this.cartModel.findByIdAndDelete(cartId);
  }

  public async findAll(userId: string): Promise<Cart[]> {
    const result = await this.cartModel.find({ user_id: userId }).populate({
      path: 'recommended_routine_id',
    });

    if (!result || result.length === 0) {
      return [];
    }

    const mappedEntites = result.map((e) => {
      return CartMapper.mapSchemaToEntity(e);
    });

    return mappedEntites;
  }

  public async findOne(cartId: string): Promise<Cart | null> {
    const result = await this.cartModel.findById(cartId);

    if (!result) {
      return null;
    }

    return CartMapper.mapSchemaToEntity(result);
  }

  public async findOneByRoutineId(
    recommendedRoutineId: string,
  ): Promise<Cart | null> {
    const result = await this.cartModel.findOne({
      recommended_routine_id: recommendedRoutineId,
    });

    if (!result) {
      return null;
    }

    return CartMapper.mapSchemaToEntity(result);
  }
}
