import { Resolution } from "src/domain/__common__/enums/resolution.enum";

export class FindUserInput {
  id: string; // this is primary key in user table got from user decorator

  resolution: Resolution; // resolution for finding image
}
