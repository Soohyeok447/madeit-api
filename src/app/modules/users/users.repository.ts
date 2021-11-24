import { EntityRepository, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User>{

  public async findOneByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  public async findOneById(id: string) {
    return this.findOne({ where: { id } });
  }

  public async findOneByUsername(username: string) {
    return this.findOne({ where: { username } });
  }

  public async cleanUp() {
    return this.createQueryBuilder().delete().from(User).execute();
  }

  public async updateRefreshToken(id: number, refreshToken: string) {
    const user = await this.findOne(id);

    const { refreshToken: _ , ...other } = user;

    return this.update(id, {
      refreshToken,
      ...other,
    });
  }


  // /**
  //  * 로그아웃 시 실행
  //  * @param user 
  //  * @returns 
  //  */
  // public async removeRefreshToken(id: number) {
  //   return await this.update(id, {
  //     refreshToken: null,
  //   });
  // }
}