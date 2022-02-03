import { NotFoundException } from "@nestjs/common";

export class NotFoundImageException extends NotFoundException {
  constructor(){
    super('이미지 없음');
  }
}