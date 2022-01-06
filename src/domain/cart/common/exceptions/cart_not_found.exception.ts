import { NotFoundException } from "@nestjs/common";

export class CartNotFoundException extends NotFoundException {
  constructor(){
    super('장바구니에 없음');
  }
}