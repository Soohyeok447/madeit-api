/**
 * cart model이 user model로부터 분리 됐을 때
 * 수정 대비용
 */

import { Cart } from "../../models/cart.model";
import { CreateCartDto } from "./dtos/create.dto";
import { UpdateCartDto } from "./dtos/update.dto";


export abstract class CartRepository {
  abstract create(data: CreateCartDto): Promise<void>;

  // abstract update(id: string, data: UpdateCartDto): Promise<void>;

  abstract delete(cartId: string): Promise<void>;

  abstract findAll(userId: string): Promise<Cart[]>;

  abstract findOne(cartId: string): Promise<Cart>;
}
