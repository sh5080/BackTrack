import * as Type from "../../types/type";
import { AuthEntity } from "../entities/auth.entity";
import { AppDataSource } from "../../loaders/dbLoader";

export const AuthRepository = AppDataSource.getRepository(AuthEntity).extend({
  async createUser(user: Type.User) {
    const { username, email, password } = user;

    const userData = this.create({
      username,
      email,
      password,
    });

    await this.save(userData);
    return userData;
  },
  async checkDuplicateUsername(username: string): Promise<boolean> {
    const existingUser = await this.findOne({
      where: { username },
    });

    return !!existingUser;
  },
  async login(username: string, password: string) {
    const existingUser = await this.findOne({
      where: { username },
    });

    return existingUser;
  },
  async findUserByEmail(email: string) {
    const user = await AuthRepository.findOne({ where: { email } });
    return user;
  },

  // async saveOauthUser(
  //   user: Type.OauthUser
  // ) {

  //   const { username, email, oauthProvider } = user;

  //   const newUser = this.create({
  //      username,
  //      email,
  //      oauth_provide,
  //   });

  //   await this.save(newUser);

  //   return newUser;
  // };
});
