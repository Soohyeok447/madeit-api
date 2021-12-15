import { Gender } from "src/domain/models/enum/gender.enum";
import { Job } from "src/domain/models/enum/job.enum";

export class CreateUserDto {
  public user_id: string;

  public email?: string;

  public username?: string;

  public gender?: Gender;

  public job?: Job;

  public birth?: string;

  public provider: string;
}
