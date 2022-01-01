/**
 * cart model이 user model로부터 분리 됐을 때
 * 수정 대비용
 */

// import { Injectable } from '@nestjs/common';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
// import { CartRepository } from 'src/domain/repositories/cart.repository';
// import { Cart } from 'src/domain/models/cart.model';
// import { CreateCartDto } from 'src/domain/repositories/dto/cart/create.dto';
// import { UpdateCartDto } from 'src/domain/repositories/dto/cart/update.dto';

// @Injectable()
// export class CartRepositoryImpl implements CartRepository {
//   constructor(
//     @InjectModel('Cart')
//     private readonly cartModel: Model<Cart>,
//   ) { }

//   public async create(data: CreateCartDto): Promise<void> {
//     const newCart = new this.cartModel(data);

//     const result = await newCart.save();

//     return result.id;
//   }

//   public async update(id: string, data: UpdateCartDto): Promise<void> {
//     throw new Error('Method not implemented.');
//   }
//   public async delete(id: string): Promise<void> {
//     throw new Error('Method not implemented.');
//   }
//   public async findAll(next?: string): Promise<{ data: Cart[]; paging: { nextCursor: string; hasMore: boolean; }; }> {
//     throw new Error('Method not implemented.');
//   }
//   public async findOne(id: string): Promise<Cart> {
//     throw new Error('Method not implemented.');
//   }
// }
