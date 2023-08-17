import * as Type from "../../types/type";
import { AuthEntity } from "../entities/auth.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";
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
  async login(username: string) {
    const existingUser = await this.findOne({
      where: { username },
    });

    return existingUser;
  },
  async findUser(username?: string, email?: string) {
    try {
      if (username && email) {
        const user = await this.findOne({ where: { username, email } });
        if (user) {
          return user;
        } else {
          throw new AppError(
            CommonError.RESOURCE_NOT_FOUND,
            "사용자를 찾을 수 없습니다.",
            404
          );
        }
      } else if (username) {
        const user = await this.findOne({ where: { username } });
        return user;
      } else if (email) {
        const user = await this.findOne({ where: { email } });

        return user;
      } else {
        throw new AppError(
          CommonError.RESOURCE_NOT_FOUND,
          "사용자 정보를 찾을 수 없습니다.",
          404
        );
      }
    } catch (error) {
      throw error;
    }
  },

  async saveOauthUser(user: Type.OauthUser) {
    const { username, email, oauthProvider } = user;

    const newUser = this.create({
      username,
      email,
      oauth_provider: oauthProvider,
    });

    await this.save(newUser);

    return newUser;
  },
});
