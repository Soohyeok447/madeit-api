import { NotFoundException } from "../NotFoundException";

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(`유저를 찾을 수 없음`, 70);
  }
}
