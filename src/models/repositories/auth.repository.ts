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
  async updateUserByUsername(
    username: string,
    nickname?: string,
    email?: string
  ) {
    try {
      await this.update({ username }, { nickname, email });
      const newUser = this.findOne({ where: { username } });
      return newUser;
    } catch (error) {
      throw new AppError(
        CommonError.DB_ERROR,
        "회원정보 업데이트 중 오류입니다.",
        404
      );
    }
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
            CommonError.DB_ERROR,
            "없는 사용자이거나 동일한 사용자의 아이디와 이메일이 아닙니다.",
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
          "없는 사용자입니다.",
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
