export class ModifyUserUsecaseParams {
  id: string; // this is primary key in user table got from user decorator

  username?: string;

  age?: number;

  goal?: string;
  
  statusMessage?: string;
}
