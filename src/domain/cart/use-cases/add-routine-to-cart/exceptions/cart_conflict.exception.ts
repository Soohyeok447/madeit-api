import { ConflictException } from "@nestjs/common";

export class CartConflictException extends ConflictException {
  constructor(){
    super('장바구니에 이미 해당 루틴 존재');
  }
}