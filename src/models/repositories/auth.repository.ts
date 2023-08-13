import { User } from "../../types/type";
import { AuthEntity } from "../entities/auth.entity";
import { AppDataSource } from "../../loaders/dbLoader";

export const AuthRepository = AppDataSource.getRepository(AuthEntity).extend({
  async createUser(user: User) {
    const { username, email, password } = user;

    const userData = this.create({
      username,
      email,
      password,
    });
    console.log(userData);
    await this.save(userData);
    return userData;
  },
  async checkDuplicateUsername(username: string): Promise<boolean> {
    const existingUser = await this.findOne({
      where: { username },
    });
    return !!existingUser;
  },
});
