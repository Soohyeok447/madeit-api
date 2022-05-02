import { Admin } from '../../entities/Admin';

export abstract class AdminRepository {
  public abstract save(identifier: string, password: string): Promise<Admin>;

  public abstract modifyPassword(id: string, password: string): Promise<Admin>;

  public abstract findOne(id: string): Promise<Admin | null>;

  public abstract findOneByIndentifier(
    identifier: string,
  ): Promise<Admin | null>;
}
