/**
 * cart model이 user model로부터 분리 됐을 때
 * 수정 대비용
 */


// import { Cart } from "../models/cart.model";
// import { CreateCartDto } from "./dto/cart/create.dto";
// import { UpdateCartDto } from "./dto/cart/update.dto";

// export abstract class CartRepository {
//   abstract create(data: CreateCartDto): Promise<void>;

//   abstract update(id: string, data: UpdateCartDto): Promise<void>;

//   abstract delete(id: string): Promise<void>;

//   abstract findAll(next?:string): Promise<{
//     data: Cart[],
//     paging: {
//       nextCursor: string,
//       hasMore: boolean,
//     }
//   }>;

//   abstract findOne(id: string): Promise<Cart>;
// }
