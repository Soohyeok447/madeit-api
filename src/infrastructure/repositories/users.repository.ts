import { EntityRepository, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { hash } from "src/infrastructure/util/hash";

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User>{

  public async findOneByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  public async findOneByUsername(username: string) {
    return this.findOne({ where: { username } });
  }

  public async updateRefreshToken(id: number, refreshToken: string) {
    const user = await this.findOne(id);

    const hashedRefreshToken = await hash(refreshToken);
    
    const { refreshToken: _, ...other } = user;

    return this.update(id, {
      refreshToken: hashedRefreshToken,
      ...other,
    });
  }
}