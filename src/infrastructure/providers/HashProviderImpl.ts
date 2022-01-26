import * as bcrypt from 'bcrypt';
import { HashProvider } from 'src/domain/providers/HashProvider';

export class HashProviderImpl implements HashProvider {
  public async hash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    const hashedData = await bcrypt.hash(data, salt);

    return hashedData;
  }

  public async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }

}
