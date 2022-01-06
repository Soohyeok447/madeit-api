import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from 'src/domain/cart/cart.model';
import { CartRepository } from 'src/domain/cart/cart.repository';
import { CreateCartDto } from 'src/domain/cart/common/dtos/create.dto';
import { UpdateCartDto } from 'src/domain/cart/common/dtos/update.dto';

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


// public async findCartById(id: string): Promise<User> {
//   const result = await this.userModel
//     .findById(id)
//     .exists('deleted_at', false)
//     .populate({
//       path: 'shopping_cart',
//     })
//     .lean();

//   if (!result) {
//     return undefined;
//   }

//   return result;
// }

// public async updateCart(
//   id: string,
//   cartData: UpdateCartDto,
//   type: string,
// ): Promise<void> {
//   const user = await this.userModel.findById(id);

//   if (!user) {
//     throw 'userNotFound';
//   }

//   switch (type) {
//     case 'delete': {
//       const assertResult = user['shopping_cart'].find(
//         (e) => e == cartData.routineId,
//       );

//       if (!assertResult) {
//         throw 'noRoutineInCart';
//       }

//       await user
//         .updateOne(
//           {
//             updated_at: moment().format(),
//             $pull: {
//               shopping_cart: cartData.routineId,
//             },
//           },
//           { runValidators: true },
//         )
//         .exists('deleted_at', false);

//       break;
//     }
//     case 'add': {
//       const assertResult = user['shopping_cart'].find(
//         (e) => e == cartData.routineId,
//       );

//       if (assertResult) {
//         throw 'conflict';
//       }

//       await user
//         .updateOne(
//           {
//             updated_at: moment().format(),
//             $push: {
//               shopping_cart: cartData.routineId,
//             },
//           },
//           { runValidators: true },
//         )
//         .exists('deleted_at', false);

//       break;
//     }
//     default:
//       break;
//   }
// }