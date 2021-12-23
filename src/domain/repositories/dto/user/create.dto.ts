import { Gender } from 'src/domain/models/enum/gender.enum';
import { Job } from 'src/domain/models/enum/job.enum';
import { Role } from 'src/domain/models/enum/role.enum';

export class CreateUserDto {
  public user_id: string;

  public email: string;

  public provider: string;

  public roles: Role;

  public is_admin: boolean;
}
