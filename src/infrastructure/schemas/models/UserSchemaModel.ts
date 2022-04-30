import { Level } from '../../../domain/common/enums/Level';
import { ObjectId } from '../../../domain/common/types';
import { Provider } from '../../../domain/use-cases/auth/common/types/provider';

export class UserSchemaModel {
  public readonly _id?: ObjectId;

  public readonly username?: string;

  public readonly avatar_id?: ObjectId;

  public readonly email?: string;

  public readonly user_id?: string;

  public readonly age?: number;

  public readonly goal?: string;

  public readonly status_message?: string;

  public readonly refresh_token?: string;

  public readonly provider?: Provider;

  public readonly is_admin?: boolean;

  public readonly exp?: number;

  public readonly point?: number;

  public readonly level?: Level;

  public readonly created_at?: string;

  public readonly updated_at?: string;

  public readonly deleted_at?: string;
}
