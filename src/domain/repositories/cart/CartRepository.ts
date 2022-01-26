/**
 * cart model이 user model로부터 분리 됐을 때
 * 수정 대비용
 */

import { CartModel } from '../../models/CartModel';
import { CreateCartDto } from './dtos/CreateCartDto';
import { UpdateCartDto } from './dtos/UpdateCartDto';

export abstract class CartRepository {
  abstract create(data: CreateCartDto): Promise<void>;

  // abstract update(id: string, data: UpdateCartDto): Promise<void>;

  abstract delete(cartId: string): Promise<void>;

  abstract findAll(userId: string): Promise<CartModel[]>;

  abstract findOne(cartId: string): Promise<CartModel>;
}