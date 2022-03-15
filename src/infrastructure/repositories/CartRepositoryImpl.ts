import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CartModel } from '../../domain/models/CartModel';
import { CartRepository } from '../../domain/repositories/cart/CartRepository';
import { CreateCartDto } from '../../domain/repositories/cart/dtos/CreateCartDto';

@Injectable()
export class CartRepositoryImpl implements CartRepository {
  constructor(
    @InjectModel('Cart')
    private readonly cartModel: Model<CartModel>,
  ) {}

  public async create(data: CreateCartDto): Promise<CartModel> {
    const newCart = new this.cartModel(data);

    const result = await newCart.save();

    return result;
  }

  public async delete(cartId: string): Promise<void> {
    await this.cartModel.findByIdAndDelete(cartId);
  }

  public async findAll(userId: string): Promise<CartModel[]> {
    const result = await this.cartModel.find({ user_id: userId }).populate({
      path: 'recommended_routine_id',
    });

    if (!result || result.length === 0) {
      return [];
    }

    return result;
  }

  public async findOne(cartId: string): Promise<CartModel | null> {
    const result = await this.cartModel.findById(cartId);

    if (!result) {
      return null;
    }

    return result;
  }

  public async findOneByRoutineId(
    recommendedRoutineId: string,
  ): Promise<CartModel | null> {
    const result = await this.cartModel.findOne({
      recommended_routine_id: recommendedRoutineId,
    });

    if (!result) {
      return null;
    }

    return result;
  }
}
