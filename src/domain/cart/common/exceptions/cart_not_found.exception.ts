import { NotFoundException } from "@nestjs/common";

export class CartNotFoundException extends NotFoundException {
  constructor(){
    super('cartId로 해당 카트 Object를 찾지 못함');
  }
}