import { ConflictException } from "../../../../common/exceptions/ConflictException";

export class RoutineAlreadyUnactivatedException extends ConflictException{
  constructor(){
    super('이미 비활성화 된 루틴입니다', 1);
  }
}