import { Serial } from 'src/domain/entities/Serial';

export abstract class SerialRepository {
  public abstract findOneByUserId(userId: string): Promise<Serial | null>;

  /**
   * The conflict algorithm should override the old one which has the same userId.
   * Thus, an user has only one instance of the serial.
   */
  public abstract save(
    userId: string,
    email: string,
    serial: string,
  ): Promise<Serial>;

  public abstract deleteOneByUserId(userId: string): Promise<void>;
}
