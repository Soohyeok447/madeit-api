import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from 'src/domain/common/models/cart.model';
import { CartRepository } from 'src/domain/common/repositories/cart/cart.repository';
import { CreateCartDto } from 'src/domain/common/repositories/cart/dtos/create.dto';
import { UpdateCartDto } from 'src/domain/common/repositories/cart/dtos/update.dto';

@Injectable()
export class CartRepositoryImpl implements CartRepository {
  constructor(
    @InjectModel('Cart')
    private readonly cartModel: Model<Cart>,
  ) { }

  public async create(data: CreateCartDto): Promise<void> {
    const newCart = new this.cartModel(data);

    await newCart.save();
  }

  public async delete(cartId: string): Promise<void> {
    await this.cartModel.findByIdAndDelete(cartId);
  }

  public async findAll(userId: string): Promise<Cart[]> {
    const result = await this.cartModel
    .find({user_id: userId})
    .populate({
      path: 'routine_id',
    });

    if(!result || result.length === 0){
      return undefined;
    }

    return result;
  }

  public async findOne(cartId: string): Promise<Cart> {
    const result = await this.cartModel.findById(cartId);

    if(!result){
      return undefined;
    }

    return result;
  }

}