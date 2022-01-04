import { BadRequestException } from "@nestjs/common";

export class InvalidTimeException extends BadRequestException {
  constructor(message: string){
    super(message)
  }
}