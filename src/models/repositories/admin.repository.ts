import * as Type from "../../types/type";
import { AdminEntity } from "../entities/admin.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";
export const AuthRepository = AppDataSource.getRepository(AdminEntity).extend({
  async createCategory(category: Type.Category) {
    const { name, image } = category;

    const categoryData = this.create({
      name,

      image,
    });

    await this.save(categoryData);
    return categoryData;
  },
});
