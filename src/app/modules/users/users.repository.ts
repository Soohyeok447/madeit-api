import { EntityRepository, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create_user.dto";
import { User } from "./entities/user.entity";

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User>{

  public async findOneByEmail(email: string) {
    return await this.findOne({ where: { email } });
  }

  public async findOneByUsername(username: string) {
    return await this.findOne({ where: { username } });
  }

  public async cleanUp() {
    return this.createQueryBuilder().delete().from(User).execute();
  }

  public async createUser(createUserDto:CreateUserDto){
    try{
      const {email, password, username} = createUserDto;

      const user = this.create({email, password, username});
      
      await this.save(user);

      return user; 

    }catch(err){
      throw err;
    }
  }

  public async updateRefreshToken(id: number, refreshToken : string) { 
    const user = await this.findOne(id); // ???
    
    const { refreshToken: _, ...other } = user;
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
  // public async removeRefreshToken(user: User) {
  //   return await this.update(user.id, {
  //     refreshToken: null,
  //   });
  // }
}