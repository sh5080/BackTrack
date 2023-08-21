import * as Type from "../../types/type";
import { AdminEntity } from "../entities/admin.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";
export const AdminRepository = AppDataSource.getRepository(AdminEntity).extend({
  async createCategory(category: Type.Category) {
    try {
      const { name } = category;

      const categoryData = this.create({
        name,
      });

      await this.save(categoryData);
      return categoryData;
    } catch (error) {
      throw error;
    }
  },
});
