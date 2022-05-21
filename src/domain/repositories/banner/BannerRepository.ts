import { Banner } from '../../entities/Banner';
import { CreateBannerDto } from './dtos/CreateBannerDto';
import { ModifyBannerDto } from './dtos/ModifyBannerDto';

export abstract class BannerRepository {
  public abstract save(dto: CreateBannerDto): Promise<Banner>;

  public abstract modify(id: string, dto: ModifyBannerDto): Promise<Banner>;

  public abstract delete(id: string): Promise<void>;

  public abstract findOne(id: string): Promise<Banner | null>;

  public abstract findAll(): Promise<Banner[]>;
}
