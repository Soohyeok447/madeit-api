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
  public constructor(
    @InjectModel('Cart')
    private readonly cartModel: Model<CartSchemaModel>,
  ) {}

  public async create(dto: CreateCartDto): Promise<Cart> {
    const mappedDto: {
      user_id: string;
      recommended_routine_id: string;
    } = CartMapper.mapCreateDtoToSchema(dto);

    const newCart: any = new this.cartModel(mappedDto);

    const result: any = await newCart.save();

    return CartMapper.mapSchemaToEntity(result);
  }

  public async delete(cartId: string): Promise<void> {
    await this.cartModel.findByIdAndDelete(cartId);
  }

  public async findAll(userId: string): Promise<Cart[]> {
    const result: CartSchemaModel[] = await this.cartModel
      .find({ user_id: userId })
      .populate({
        path: 'recommended_routine_id',
      })
      .lean();

    if (!result || result.length === 0) {
      return [];
    }

    const mappedEntites: Cart[] = result.map((e) => {
      return CartMapper.mapSchemaToEntity(e);
    });

    return mappedEntites;
  }

  public async findOne(cartId: string): Promise<Cart | null> {
    const result: CartSchemaModel = await this.cartModel
      .findById(cartId)
      .lean();

    if (!result) {
      return null;
    }

    return CartMapper.mapSchemaToEntity(result);
  }

  public async findOneByRoutineId(
    recommendedRoutineId: string,
  ): Promise<Cart | null> {
    const result: CartSchemaModel = await this.cartModel
      .findOne({
        recommended_routine_id: recommendedRoutineId,
      })
      .lean();

    if (!result) {
      return null;
    }

    return CartMapper.mapSchemaToEntity(result);
  }
}
