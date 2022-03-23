import { Level } from '../../../domain/common/enums/Level';
import { Provider } from '../../../domain/use-cases/auth/common/types/provider';

export interface UserSchemaModel {
  readonly _id?: string;

  readonly username?: string;

  readonly avatar_id?: string;

  readonly email?: string;

  readonly user_id?: string;

  readonly age?: number;

  readonly goal?: string;

  readonly status_message?: string;

  readonly refresh_token?: string;

  readonly provider?: Provider;

  readonly is_admin?: boolean;

  readonly exp?: number;

  readonly point?: number;

  readonly level?: Level;

  readonly did_routines_in_total?: number;

  readonly did_routines_in_month?: number;

  readonly created_at?: string;

  readonly updated_at?: string;

  readonly deleted_at?: string;
}
